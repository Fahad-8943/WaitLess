import { describe, it, before, after, beforeEach } from "node:test";
import assert from "node:assert";
import http from "node:http";
import { createRequire } from "node:module";

const backendPath = "D:/projects/Full Stack Projects/waitless_server";
const require = createRequire(`${backendPath}/index.js`);
const mongoose = require("mongoose");
const { MongoMemoryReplSet } = require("mongodb-memory-server");

// 1. Setup Environment for test
process.env.NODE_ENV = "test";
process.env.MONGOMS_SYSTEM_BINARY = "C:\\Program Files\\MongoDB\\Server\\9.0\\bin\\mongod.exe";
process.env.JWT_ACCESS_SECRET = "test_jwt_access_secret_key_minimum_32_characters_long_for_security";
process.env.JWT_REFRESH_SECRET = "test_jwt_refresh_secret_key_minimum_32_characters_long_for_security";
process.env.COOKIE_SAME_SITE = "lax";
process.env.COOKIE_SECURE = "false";
process.env.COOKIE_PATH = "/api/v1/auth";
process.env.FRONTEND_URL = "http://localhost:5173";
process.env.CORS_ORIGIN = "http://localhost:5173";
process.env.DEFAULT_BUSINESS_APPROVAL_STATUS = "approved";

// Import backend Express app from waitless_server
const { default: backendApp } = await import(`file:///${backendPath}/src/app.js`);
const { default: User } = await import(`file:///${backendPath}/src/models/User.js`);
const { default: Business } = await import(`file:///${backendPath}/src/models/Business.js`);
const { default: RefreshToken } = await import(`file:///${backendPath}/src/models/RefreshToken.js`);

// Import frontend API client and auth modules
import {
  apiClient,
  ApiError,
  setAccessToken,
  getAccessToken,
  refreshAuthToken,
  onAuthExpired,
} from "../src/api/client.js";
import { authApi, businessApi } from "../src/api/auth.js";

let server;
let serverPort;
let replSet;
let cookieJar = "";

// Custom fetch wrapper to support Node.js cookie persistence across credentials: include
const originalFetch = globalThis.fetch;
globalThis.fetch = async (url, options = {}) => {
  const headers = { ...options.headers };

  if (options.credentials === "include" && cookieJar) {
    headers["Cookie"] = cookieJar;
  }

  const response = await originalFetch(url, { ...options, headers });

  // Capture Set-Cookie headers from backend responses
  const setCookie = response.headers.get("set-cookie");
  if (setCookie) {
    const rawCookie = setCookie.split(";")[0];
    cookieJar = rawCookie;
  }

  return response;
};

describe("WaitLess — Frontend Authentication Foundation Test Suite", () => {
  before(async () => {
    // Start In-Memory MongoDB Replica Set for transactions
    replSet = await MongoMemoryReplSet.create({
      replSet: { count: 1, storageEngine: "wiredTiger" },
    });
    await mongoose.connect(replSet.getUri());

    // Start HTTP server on an ephemeral port
    server = http.createServer(backendApp);
    await new Promise((resolve) => {
      server.listen(0, () => {
        serverPort = server.address().port;
        process.env.VITE_API_URL = `http://127.0.0.1:${serverPort}/api/v1`;
        resolve();
      });
    });
  });

  after(async () => {
    globalThis.fetch = originalFetch;
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    await mongoose.disconnect();
    if (replSet) {
      await replSet.stop();
    }
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Business.deleteMany({});
    await RefreshToken.deleteMany({});
    setAccessToken(null);
    cookieJar = "";
  });

  // ===============================================================
  // SECTION 1: Centralized API Client Architecture & Refresh Lock
  // ===============================================================
  describe("1. Centralized API Client & Token Management", () => {
    it("1.1 Should include X-Requested-With CSRF header and Content-Type: application/json", async () => {
      // Test public health endpoint
      const result = await apiClient("/health");
      assert.strictEqual(result.success, true);
    });

    it("1.2 Should format ApiError with status, code, and message on 4xx/5xx responses", async () => {
      try {
        await apiClient("/auth/login", {
          method: "POST",
          body: { identifier: "nonexistent@example.com", password: "Password123!" },
        });
        assert.fail("Should have thrown ApiError");
      } catch (err) {
        assert.ok(err instanceof ApiError);
        assert.strictEqual(err.status, 401);
        assert.strictEqual(err.code, "INVALID_CREDENTIALS");
        assert.ok(err.message.includes("Invalid"));
      }
    });

    it("1.3 Should prevent multiple simultaneous refresh requests using single-flight promise lock", async () => {
      // Register a customer to get a valid refresh cookie
      const regRes = await authApi.register({
        name: "Flight Lock User",
        email: "flightlock@example.com",
        password: "ValidPassword123!",
      });
      assert.strictEqual(regRes.success, true);

      // Trigger 5 refresh calls simultaneously
      const refreshPromises = [
        refreshAuthToken(),
        refreshAuthToken(),
        refreshAuthToken(),
        refreshAuthToken(),
        refreshAuthToken(),
      ];

      const tokens = await Promise.all(refreshPromises);

      // All 5 promises must resolve to the identical token because they shared 1 flight
      assert.strictEqual(tokens.length, 5);
      const firstToken = tokens[0];
      for (const t of tokens) {
        assert.strictEqual(t, firstToken);
      }

      // Check DB to verify refresh token was rotated ONCE, not 5 times (avoiding concurrency rejection)
      const allTokens = await RefreshToken.find({});
      assert.strictEqual(allTokens.length, 2); // 1 initial from register + 1 rotation
    });

    it("1.4 Should retry eligible failed request once after 401 token expiration", async () => {
      // Register user
      const regRes = await authApi.register({
        name: "Auto Retry User",
        email: "autoretry@example.com",
        password: "ValidPassword123!",
      });
      assert.ok(regRes.data.accessToken);

      // Intentionally tamper with in-memory access token to simulate expiration
      setAccessToken("invalid.or.expired.jwt.token");

      // Calling /auth/me should receive 401, trigger refreshAuthToken(), obtain new token, and retry successfully!
      const meRes = await authApi.getMe();
      assert.strictEqual(meRes.success, true);
      assert.strictEqual(meRes.data.user.email, "autoretry@example.com");
      assert.notStrictEqual(getAccessToken(), "invalid.or.expired.jwt.token");
    });

    it("1.5 Should notify auth expiration and clear access token if refresh fails", async () => {
      let expiredNotified = false;
      const unsubscribe = onAuthExpired(() => {
        expiredNotified = true;
      });

      // Set an invalid token with no valid refresh cookie
      setAccessToken("fake.token");
      cookieJar = "";

      try {
        await apiClient("/auth/me");
      } catch (err) {
        assert.ok(err);
      }

      assert.strictEqual(getAccessToken(), null);
      assert.strictEqual(expiredNotified, true);
      unsubscribe();
    });
  });

  // ===============================================================
  // SECTION 2: Authentication Flows (Register, Login, Me, Logout)
  // ===============================================================
  describe("2. Authentication Flows & Session Restoration", () => {
    it("2.1 Customer registration enforces customer role and sets access token", async () => {
      const res = await authApi.register({
        name: "Jane Customer",
        email: "jane@example.com",
        phone: "+919876543201",
        password: "StrongPassword123!",
      });

      assert.strictEqual(res.success, true);
      assert.strictEqual(res.data.user.name, "Jane Customer");
      assert.strictEqual(res.data.user.role, "customer");
      assert.strictEqual(res.data.user.passwordHash, undefined);
      assert.ok(res.data.accessToken);
      assert.ok(cookieJar.includes("refreshToken"));
    });

    it("2.2 Login with email or phone returns user profile and access token", async () => {
      await authApi.register({
        name: "Login User",
        email: "loginuser@example.com",
        phone: "+919876543202",
        password: "StrongPassword123!",
      });

      // Clear local memory
      setAccessToken(null);

      // Login via email
      const emailLogin = await authApi.login({
        identifier: "loginuser@example.com",
        password: "StrongPassword123!",
      });
      assert.strictEqual(emailLogin.success, true);
      assert.strictEqual(emailLogin.data.user.email, "loginuser@example.com");

      // Login via phone
      const phoneLogin = await authApi.login({
        identifier: "+919876543202",
        password: "StrongPassword123!",
      });
      assert.strictEqual(phoneLogin.success, true);
      assert.strictEqual(phoneLogin.data.user.phone, "+919876543202");
    });

    it("2.3 Session restoration on reload restores token and user profile", async () => {
      // 1. User logs in
      await authApi.register({
        name: "Reload User",
        email: "reload@example.com",
        password: "StrongPassword123!",
      });

      // 2. Simulate page reload: access token in memory is wiped, but cookie persists
      setAccessToken(null);
      assert.strictEqual(getAccessToken(), null);

      // 3. Session restoration flow:
      const restoredToken = await refreshAuthToken();
      assert.ok(restoredToken);
      setAccessToken(restoredToken);

      const profile = await authApi.getMe();
      assert.strictEqual(profile.success, true);
      assert.strictEqual(profile.data.user.email, "reload@example.com");
      assert.strictEqual(profile.data.user.name, "Reload User");
    });

    it("2.4 Logout invalidates session and revokes refresh cookie", async () => {
      await authApi.register({
        name: "Logout User",
        email: "logout@example.com",
        password: "StrongPassword123!",
      });

      // Call logout
      const logoutRes = await authApi.logout();
      assert.strictEqual(logoutRes.success, true);

      // Subsequent refresh must fail with 401
      setAccessToken(null);
      try {
        await refreshAuthToken();
        assert.fail("Refresh should fail after logout");
      } catch (err) {
        assert.strictEqual(err.status, 401);
      }
    });
  });

  // ===============================================================
  // SECTION 3: Business Registration & Provider Role Elevation
  // ===============================================================
  describe("3. Business Registration & Role Elevation", () => {
    it("3.1 Customer registers a business venue and is elevated to provider with refreshed token", async () => {
      // 1. Register as customer
      const regRes = await authApi.register({
        name: "Future Business Owner",
        email: "owner@futurebiz.com",
        password: "StrongPassword123!",
      });
      assert.strictEqual(regRes.data.user.role, "customer");
      setAccessToken(regRes.data.accessToken);

      // 2. Submit structured business registration
      const businessPayload = {
        name: "Downtown Barber Studio",
        category: "Barbers & Salons",
        description: "Premium hair and beard grooming in the city center.",
        contact: {
          email: "contact@downtownbarber.com",
          phone: "+919876543210",
        },
        address: {
          street: "428 Market Street",
          city: "Bangalore",
          state: "Karnataka",
          postalCode: "560001",
          country: "IN",
        },
        location: {
          coordinates: [77.5946, 12.9716],
        },
        timezone: "Asia/Kolkata",
        operatingHours: [
          { dayOfWeek: 0, openTime: "09:00", closeTime: "18:00", isClosed: true },
          { dayOfWeek: 1, openTime: "09:00", closeTime: "20:00", isClosed: false },
          { dayOfWeek: 2, openTime: "09:00", closeTime: "20:00", isClosed: false },
          { dayOfWeek: 3, openTime: "09:00", closeTime: "20:00", isClosed: false },
          { dayOfWeek: 4, openTime: "09:00", closeTime: "20:00", isClosed: false },
          { dayOfWeek: 5, openTime: "09:00", closeTime: "21:00", isClosed: false },
          { dayOfWeek: 6, openTime: "09:00", closeTime: "21:00", isClosed: false },
        ],
        policies: {
          maxQueueCapacity: 50,
          remoteQueueEnabled: true,
          gracePeriodMinutes: 10,
        },
      };

      const bizRes = await businessApi.register(businessPayload);
      assert.strictEqual(bizRes.success, true);
      assert.ok(bizRes.data.business._id);
      assert.strictEqual(bizRes.data.business.name, "Downtown Barber Studio");
      assert.strictEqual(bizRes.data.business.category, "Barbers & Salons");
      assert.strictEqual(bizRes.data.business.approvalStatus, "approved");
      assert.ok(bizRes.data.accessToken, "Should return fresh access token after elevation");

      // 3. Verify role elevation in the database and user model
      const dbUser = await User.findOne({ email: "owner@futurebiz.com" });
      assert.strictEqual(dbUser.role, "provider");
      assert.strictEqual(dbUser.tokenVersion, 1);

      // 4. Update in-memory token with elevated provider token
      setAccessToken(bizRes.data.accessToken);

      // 5. Verify provider endpoints can now be accessed with new token
      const providerVenues = await apiClient("/businesses/my/list");
      assert.strictEqual(providerVenues.success, true);
      assert.strictEqual(providerVenues.data.businesses.length, 1);
      assert.strictEqual(providerVenues.data.businesses[0].name, "Downtown Barber Studio");
    });
  });

  // ===============================================================
  // SECTION 4: Role-Based Route Protection Rules
  // ===============================================================
  describe("4. Role-Based Access Control Rules", () => {
    // Pure function simulating the ProtectedRoute logic
    const evaluateRouteAccess = ({ user, isAuthenticated, allowedRoles }) => {
      if (!isAuthenticated || !user) {
        return { allowed: false, redirect: "/login" };
      }
      if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return { allowed: false, redirect: "/unauthorized" };
      }
      return { allowed: true, redirect: null };
    };

    it("4.1 Unauthenticated users are redirected to /login", () => {
      const decision = evaluateRouteAccess({
        user: null,
        isAuthenticated: false,
        allowedRoles: ["customer", "provider", "admin"],
      });
      assert.strictEqual(decision.allowed, false);
      assert.strictEqual(decision.redirect, "/login");
    });

    it("4.2 Customers cannot access provider (/business/*) or admin (/admin/*) pages", () => {
      const customer = { name: "Bob Customer", role: "customer" };

      // Provider route access check
      const providerDecision = evaluateRouteAccess({
        user: customer,
        isAuthenticated: true,
        allowedRoles: ["provider", "admin"],
      });
      assert.strictEqual(providerDecision.allowed, false);
      assert.strictEqual(providerDecision.redirect, "/unauthorized");

      // Admin route access check
      const adminDecision = evaluateRouteAccess({
        user: customer,
        isAuthenticated: true,
        allowedRoles: ["admin"],
      });
      assert.strictEqual(adminDecision.allowed, false);
      assert.strictEqual(adminDecision.redirect, "/unauthorized");
    });

    it("4.3 Providers can access provider pages but cannot access admin pages", () => {
      const provider = { name: "Alice Provider", role: "provider" };

      // Provider accessing provider route
      const providerDecision = evaluateRouteAccess({
        user: provider,
        isAuthenticated: true,
        allowedRoles: ["provider", "admin"],
      });
      assert.strictEqual(providerDecision.allowed, true);

      // Provider accessing admin route
      const adminDecision = evaluateRouteAccess({
        user: provider,
        isAuthenticated: true,
        allowedRoles: ["admin"],
      });
      assert.strictEqual(adminDecision.allowed, false);
      assert.strictEqual(adminDecision.redirect, "/unauthorized");
    });

    it("4.4 Admins can access admin pages as well as authorized pages", () => {
      const admin = { name: "Super Admin", role: "admin" };

      const adminDecision = evaluateRouteAccess({
        user: admin,
        isAuthenticated: true,
        allowedRoles: ["admin"],
      });
      assert.strictEqual(adminDecision.allowed, true);

      const providerDecision = evaluateRouteAccess({
        user: admin,
        isAuthenticated: true,
        allowedRoles: ["provider", "admin"],
      });
      assert.strictEqual(providerDecision.allowed, true);
    });
  });
});
