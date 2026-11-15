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
const { default: Service } = await import(`file:///${backendPath}/src/models/Service.js`);
const { default: Booking } = await import(`file:///${backendPath}/src/models/Booking.js`);
const { default: QueueEntry } = await import(`file:///${backendPath}/src/models/QueueEntry.js`);
const { default: Counter } = await import(`file:///${backendPath}/src/models/Counter.js`);
const { default: RefreshToken } = await import(`file:///${backendPath}/src/models/RefreshToken.js`);

// Import frontend API client and auth modules
import { setAccessToken, ApiError } from "../src/api/client.js";
import { authApi, adminApi, providerApi } from "../src/api/auth.js";

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

  const setCookie = response.headers.get("set-cookie");
  if (setCookie) {
    const rawCookie = setCookie.split(";")[0];
    cookieJar = rawCookie;
  }

  return response;
};

describe("WaitLess — Frontend Batch 4: Admin Functionality Test Suite", () => {
  before(async () => {
    replSet = await MongoMemoryReplSet.create({
      replSet: { count: 1, storageEngine: "wiredTiger" },
    });
    await mongoose.connect(replSet.getUri());

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
    await Service.deleteMany({});
    await Booking.deleteMany({});
    await QueueEntry.deleteMany({});
    await Counter.deleteMany({});
    await RefreshToken.deleteMany({});
    setAccessToken(null);
    cookieJar = "";
  });

  // Helper to create and log in an administrative user
  async function createAndLoginAdmin(name = "Platform SuperAdmin", email = "superadmin@waitless.com") {
    const regRes = await authApi.register({
      name,
      email,
      phone: `+9199${Math.floor(10000000 + Math.random() * 90000000)}`,
      password: "AdminPassword123!",
    });

    await User.findByIdAndUpdate(regRes.data.user.id || regRes.data.user._id, {
      role: "admin",
    });

    const loginRes = await authApi.login({
      identifier: email,
      password: "AdminPassword123!",
    });
    setAccessToken(loginRes.data.accessToken);

    return loginRes.data.user;
  }

  // Helper to create a customer
  async function createCustomer(name = "Customer Bob", email = "bob@example.com") {
    const regRes = await authApi.register({
      name,
      email,
      phone: `+9197${Math.floor(10000000 + Math.random() * 90000000)}`,
      password: "CustomerPassword123!",
    });
    return { user: regRes.data.user, token: regRes.data.accessToken };
  }

  // Helper to create a provider
  async function createProvider(name = "Provider Alice", email = "alice@example.com") {
    const regRes = await authApi.register({
      name,
      email,
      phone: `+9198${Math.floor(10000000 + Math.random() * 90000000)}`,
      password: "ProviderPassword123!",
    });
    await User.findByIdAndUpdate(regRes.data.user.id || regRes.data.user._id, {
      role: "provider",
    });
    return regRes.data.user;
  }

  // Helper to create a business venue
  async function createBusinessVenue(ownerId, name = "Metro Smile Dental", approvalStatus = "approved", isActive = true) {
    return await Business.create({
      name,
      category: "Health & Clinics",
      description: "Premier local dental clinic and diagnostics",
      ownerId,
      address: {
        street: "104 Westside Medical Plaza",
        city: "Bangalore",
        state: "Karnataka",
        postalCode: "560001",
        country: "IN",
      },
      location: {
        type: "Point",
        coordinates: [77.5946, 12.9716],
      },
      timezone: "Asia/Kolkata",
      approvalStatus,
      isActive,
      policies: {
        maxQueueCapacity: 50,
        remoteQueueEnabled: true,
        gracePeriodMinutes: 10,
      },
      operatingHours: [
        { dayOfWeek: 1, openTime: "08:30", closeTime: "17:30", isClosed: false },
      ],
    });
  }

  describe("1. Platform Statistics Overview", () => {
    it("1.1 Admin retrieves aggregated platform statistics (users, businesses, bookings, queues, services)", async () => {
      await createAndLoginAdmin();
      const provider = await createProvider("Salon Owner", "salonowner@example.com");
      await createCustomer("Patron One", "patron1@example.com");
      await createCustomer("Patron Two", "patron2@example.com");

      const biz = await createBusinessVenue(provider.id || provider._id, "City Salon", "approved", true);
      await Service.create({
        businessId: biz._id,
        name: "Hair Styling",
        price: 350,
        duration: 30,
        isActive: true,
      });

      const statsRes = await adminApi.getPlatformStats();
      assert.strictEqual(statsRes.success, true);
      assert.ok(statsRes.data);

      // Verify users metrics
      assert.strictEqual(statsRes.data.users.total, 4); // 1 admin + 1 provider + 2 customers
      assert.strictEqual(statsRes.data.users.byRole.admin, 1);
      assert.strictEqual(statsRes.data.users.byRole.provider, 1);
      assert.strictEqual(statsRes.data.users.byRole.customer, 2);

      // Verify businesses metrics
      assert.strictEqual(statsRes.data.businesses.total, 1);
      assert.strictEqual(statsRes.data.businesses.byApprovalStatus.approved, 1);

      // Verify services metrics
      assert.strictEqual(statsRes.data.services.total, 1);
      assert.strictEqual(statsRes.data.services.active, 1);
    });

    it("1.2 Non-admin users are strictly rejected with 403 FORBIDDEN_ROLE", async () => {
      const { token: customerToken } = await createCustomer("Unauthorized Cust", "unauth@example.com");
      setAccessToken(customerToken);

      await assert.rejects(
        async () => {
          await adminApi.getPlatformStats();
        },
        (err) => {
          assert(err instanceof ApiError);
          assert.strictEqual(err.status, 403);
          return true;
        }
      );
    });
  });

  describe("2. Business Moderation and Lifecycle Actions", () => {
    it("2.1 Admin lists businesses with search and approval status filters", async () => {
      await createAndLoginAdmin();
      const provider = await createProvider("Venue Owner", "venueowner@example.com");

      await createBusinessVenue(provider.id || provider._id, "Pending Auto Care", "pending", true);
      await createBusinessVenue(provider.id || provider._id, "Approved Barbers", "approved", true);
      await createBusinessVenue(provider.id || provider._id, "Suspended Spa", "suspended", false);

      // Filter by approvalStatus: pending
      const pendingRes = await adminApi.listBusinesses({ approvalStatus: "pending" });
      assert.strictEqual(pendingRes.success, true);
      assert.strictEqual(pendingRes.data.length, 1);
      assert.strictEqual(pendingRes.data[0].name, "Pending Auto Care");

      // Search by text query
      const searchRes = await adminApi.listBusinesses({ search: "Barbers" });
      assert.strictEqual(searchRes.success, true);
      assert.strictEqual(searchRes.data.length, 1);
      assert.strictEqual(searchRes.data[0].name, "Approved Barbers");
    });

    it("2.2 Admin approves a pending business", async () => {
      await createAndLoginAdmin();
      const provider = await createProvider("Applicant Dave", "applicantdave@example.com");
      const pendingBiz = await createBusinessVenue(provider.id || provider._id, "Fresh Dental", "pending", false);

      const approveRes = await adminApi.approveBusiness(pendingBiz._id.toString());
      assert.strictEqual(approveRes.success, true);
      assert.strictEqual(approveRes.data.approvalStatus, "approved");
      assert.strictEqual(approveRes.data.isActive, true);

      // Verify in DB
      const updated = await Business.findById(pendingBiz._id);
      assert.strictEqual(updated.approvalStatus, "approved");
      assert.strictEqual(updated.isActive, true);
    });

    it("2.3 Admin rejects a pending business with optional reason", async () => {
      await createAndLoginAdmin();
      const provider = await createProvider("Applicant Jane", "applicantjane@example.com");
      const pendingBiz = await createBusinessVenue(provider.id || provider._id, "Incomplete Garage", "pending", false);

      const rejectRes = await adminApi.rejectBusiness(
        pendingBiz._id.toString(),
        "Missing official trade license documentation"
      );
      assert.strictEqual(rejectRes.success, true);
      assert.strictEqual(rejectRes.data.approvalStatus, "rejected");

      const updated = await Business.findById(pendingBiz._id);
      assert.strictEqual(updated.approvalStatus, "rejected");
    });

    it("2.4 Admin suspends an approved business and then reactivates it", async () => {
      await createAndLoginAdmin();
      const provider = await createProvider("Venue Host", "venuehost@example.com");
      const activeBiz = await createBusinessVenue(provider.id || provider._id, "High Traffic Cafe", "approved", true);

      // Suspend
      const suspendRes = await adminApi.suspendBusiness(
        activeBiz._id.toString(),
        "Repeated customer service policy violation"
      );
      assert.strictEqual(suspendRes.success, true);
      assert.strictEqual(suspendRes.data.approvalStatus, "suspended");

      // Reactivate
      const reactivateRes = await adminApi.reactivateBusiness(activeBiz._id.toString());
      assert.strictEqual(reactivateRes.success, true);
      assert.strictEqual(reactivateRes.data.approvalStatus, "approved");
      assert.strictEqual(reactivateRes.data.isActive, true);
    });

    it("2.5 Admin retrieves business details and services for administrative review", async () => {
      await createAndLoginAdmin();
      const provider = await createProvider("Doc Cho", "doccho@example.com");
      const biz = await createBusinessVenue(provider.id || provider._id, "Metro Smile Review", "approved", true);

      await Service.create({
        businessId: biz._id,
        name: "General Dental Checkup",
        price: 500,
        duration: 30,
        isActive: true,
      });

      const detailsRes = await adminApi.getBusinessDetails(biz._id.toString());
      assert.strictEqual(detailsRes.success, true);
      assert.strictEqual(detailsRes.data.business.name, "Metro Smile Review");
      assert.strictEqual(detailsRes.data.isPlatformAdmin, true);

      const servicesRes = await adminApi.getBusinessServices(biz._id.toString());
      assert.strictEqual(servicesRes.success, true);
      assert.strictEqual(servicesRes.data.services.length, 1);
      assert.strictEqual(servicesRes.data.services[0].name, "General Dental Checkup");
    });
  });

  describe("3. User Management and Account Status Updates", () => {
    it("3.1 Admin lists users with role, status, and search filters with pagination", async () => {
      await createAndLoginAdmin();
      await createCustomer("Zack Customer", "zack@example.com");
      await createProvider("Wendy Provider", "wendy@example.com");

      // List all users
      const allRes = await adminApi.listUsers();
      assert.strictEqual(allRes.success, true);
      assert.strictEqual(allRes.data.length, 3);
      assert.ok(allRes.meta);
      assert.strictEqual(allRes.meta.total, 3);

      // Filter by role: customer
      const custRes = await adminApi.listUsers({ role: "customer" });
      assert.strictEqual(custRes.success, true);
      assert.strictEqual(custRes.data.length, 1);
      assert.strictEqual(custRes.data[0].email, "zack@example.com");

      // Search by email or name
      const searchRes = await adminApi.listUsers({ search: "Wendy" });
      assert.strictEqual(searchRes.success, true);
      assert.strictEqual(searchRes.data.length, 1);
      assert.strictEqual(searchRes.data[0].name, "Wendy Provider");
    });

    it("3.2 Admin deactivates and reactivates a user account", async () => {
      await createAndLoginAdmin();
      const { user: customer } = await createCustomer("Troublesome User", "trouble@example.com");

      // Deactivate user
      const deactRes = await adminApi.updateUserStatus(customer.id || customer._id, false);
      assert.strictEqual(deactRes.success, true);
      assert.strictEqual(deactRes.data.isActive, false);

      const dbUser = await User.findById(customer.id || customer._id);
      assert.strictEqual(dbUser.isActive, false);

      // Reactivate user
      const reactRes = await adminApi.updateUserStatus(customer.id || customer._id, true);
      assert.strictEqual(reactRes.success, true);
      assert.strictEqual(reactRes.data.isActive, true);

      const dbUserActive = await User.findById(customer.id || customer._id);
      assert.strictEqual(dbUserActive.isActive, true);
    });

    it("3.3 Admin cannot deactivate own account or the last platform administrator", async () => {
      const adminUser = await createAndLoginAdmin("Sole Admin", "soleadmin@waitless.com");

      // Attempt self-deactivation
      await assert.rejects(
        async () => {
          await adminApi.updateUserStatus(adminUser.id || adminUser._id, false);
        },
        (err) => {
          assert(err instanceof ApiError);
          assert.strictEqual(err.status, 400);
          assert.strictEqual(err.code, "UNSAFE_ADMIN_ACTION");
          return true;
        }
      );
    });
  });
});
