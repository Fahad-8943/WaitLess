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

// Import frontend API modules
import {
  apiClient,
  ApiError,
  setAccessToken,
} from "../src/api/client.js";
import {
  authApi,
  businessApi,
  bookingApi,
  queueApi,
  providerApi,
} from "../src/api/auth.js";

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

describe("WaitLess — Frontend Batch 3: Provider Functionality Test Suite", () => {
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

  // Helper to create and log in a provider with elevated token
  async function createAndLoginProvider(name = "Marcus Provider", email = "marcus@example.com") {
    const regRes = await authApi.register({
      name,
      email,
      phone: `+9198${Math.floor(10000000 + Math.random() * 90000000)}`,
      password: "ProviderPassword123!",
    });
    setAccessToken(regRes.data.accessToken);

    // Elevate user role to provider directly in database for testing
    await User.findByIdAndUpdate(regRes.data.user.id || regRes.data.user._id, {
      role: "provider",
    });

    // Re-login to receive fresh provider JWT token
    const loginRes = await authApi.login({
      identifier: email,
      password: "ProviderPassword123!",
    });
    setAccessToken(loginRes.data.accessToken);

    return loginRes.data.user;
  }

  // Helper to create customer for booking/queue interactions
  async function createCustomer(name = "Customer Jane", email = "customer@example.com") {
    const regRes = await authApi.register({
      name,
      email,
      phone: `+9197${Math.floor(10000000 + Math.random() * 90000000)}`,
      password: "CustomerPassword123!",
    });
    return { user: regRes.data.user, token: regRes.data.accessToken };
  }

  // Helper to create a business venue owned by provider
  async function createBusinessVenue(ownerId, name = "Crown & Blade Studio", category = "Barbers & Salons") {
    return await Business.create({
      name,
      category,
      description: "Premier grooming and salon services",
      ownerId,
      address: {
        street: "428 Market St",
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
      approvalStatus: "approved",
      isActive: true,
      policies: {
        maxQueueCapacity: 50,
        remoteQueueEnabled: true,
        gracePeriodMinutes: 10,
      },
      operatingHours: [
        { dayOfWeek: 1, openTime: "09:00", closeTime: "20:00", isClosed: false },
      ],
    });
  }

  describe("1. Multi-Business Ownership & Dashboard", () => {
    it("1.1 Should list all businesses owned by provider and fetch aggregate overview", async () => {
      const provider = await createAndLoginProvider("Elena Vance", "elena@example.com");
      const biz1 = await createBusinessVenue(provider.id || provider._id, "Crown & Blade Studio");
      const biz2 = await createBusinessVenue(provider.id || provider._id, "Apex Grooming Lounge");

      // 1. List owned businesses
      const listRes = await providerApi.getMyBusinesses();
      assert.strictEqual(listRes.success, true);
      assert.strictEqual(listRes.data.businesses.length, 2);

      // 2. Fetch aggregate portfolio overview
      const overviewRes = await providerApi.getProviderOverview();
      assert.strictEqual(overviewRes.success, true);
      assert.strictEqual(overviewRes.data.totalBusinesses, 2);
      assert.ok(overviewRes.data.aggregatedStats);
      assert.strictEqual(overviewRes.data.aggregatedStats.totalBookings, 0);

      // 3. Fetch specific business dashboard
      const dashRes = await providerApi.getBusinessDashboard(biz1._id.toString());
      assert.strictEqual(dashRes.success, true);
      assert.strictEqual(dashRes.data.business.name, "Crown & Blade Studio");
      assert.strictEqual(dashRes.data.bookings.total, 0);
      assert.strictEqual(dashRes.data.queue.totalActive, 0);
    });

    it("1.2 Should prevent accessing business dashboard of another provider", async () => {
      const providerA = await createAndLoginProvider("Owner A", "ownerA@example.com");
      const bizA = await createBusinessVenue(providerA.id || providerA._id, "Venue A");

      // Provider B logs in
      await createAndLoginProvider("Owner B", "ownerB@example.com");

      // Attempt to access Provider A's venue dashboard
      await assert.rejects(
        async () => {
          await providerApi.getBusinessDashboard(bizA._id.toString());
        },
        (err) => {
          assert.ok(err instanceof ApiError);
          assert.strictEqual(err.status, 403);
          return true;
        }
      );
    });
  });

  describe("2. Provider Service Management", () => {
    it("2.1 Should create, list, and update services for a business venue", async () => {
      const provider = await createAndLoginProvider("Service Master", "services@example.com");
      const biz = await createBusinessVenue(provider.id || provider._id, "Signature Spa");

      // 1. Create service
      const createRes = await providerApi.createService(biz._id.toString(), {
        name: "Swedish Massage",
        description: "Full body relaxation therapy",
        price: 1200,
        duration: 60,
        isActive: true,
      });

      assert.strictEqual(createRes.success, true);
      assert.strictEqual(createRes.data.service.name, "Swedish Massage");
      const serviceId = createRes.data.service._id;

      // 2. List services for business
      const listRes = await providerApi.getServices(biz._id.toString());
      assert.strictEqual(listRes.success, true);
      assert.strictEqual(listRes.data.services.length, 1);
      assert.strictEqual(listRes.data.services[0]._id, serviceId);

      // 3. Update service details
      const updateRes = await providerApi.updateService(biz._id.toString(), serviceId, {
        name: "Deluxe Swedish Massage",
        price: 1400,
        isActive: false,
      });

      assert.strictEqual(updateRes.success, true);
      assert.strictEqual(updateRes.data.service.name, "Deluxe Swedish Massage");
      assert.strictEqual(updateRes.data.service.price, 1400);
      assert.strictEqual(updateRes.data.service.isActive, false);
    });

    it("2.2 Should validate service inputs and reject invalid payloads", async () => {
      const provider = await createAndLoginProvider("Validator Test", "validatortest@example.com");
      const biz = await createBusinessVenue(provider.id || provider._id, "Test Venue");

      // Reject negative price
      await assert.rejects(
        () =>
          providerApi.createService(biz._id.toString(), {
            name: "Haircut",
            price: -50,
            duration: 30,
          }),
        (err) => err.status === 400
      );

      // Reject duration < 1
      await assert.rejects(
        () =>
          providerApi.createService(biz._id.toString(), {
            name: "Haircut",
            price: 300,
            duration: 0,
          }),
        (err) => err.status === 400
      );
    });
  });

  describe("3. Provider Booking Management & Transitions", () => {
    it("3.1 Should view, confirm, complete, and reject bookings with status transitions", async () => {
      const provider = await createAndLoginProvider("Booking Lead", "bookinglead@example.com");
      const biz = await createBusinessVenue(provider.id || provider._id, "Elite Hair Studio");

      // Create an active service
      const svc = await Service.create({
        businessId: biz._id,
        name: "Classic Cut",
        price: 400,
        duration: 30,
        isActive: true,
      });

      // Customer creates a booking
      const { user: customer, token: customerToken } = await createCustomer("Guest Alice", "aliceguest@example.com");
      setAccessToken(customerToken);

      const futureDate = new Date(Date.now() + 86400000 * 3).toISOString();
      const bookingRes = await bookingApi.create({
        businessId: biz._id.toString(),
        serviceId: svc._id.toString(),
        bookingDate: futureDate,
        notes: "Allergic to scented oils",
      });
      const bookingId = bookingRes.data._id;

      // Log back in as provider
      await authApi.login({ identifier: "bookinglead@example.com", password: "ProviderPassword123!" })
        .then((r) => setAccessToken(r.data.accessToken));

      // 1. Provider views bookings list
      const listRes = await providerApi.getBookings(biz._id.toString());
      assert.strictEqual(listRes.success, true);
      assert.strictEqual(listRes.data.length, 1);
      assert.strictEqual(listRes.data[0].status, "pending");
      assert.strictEqual(listRes.data[0].customerId.name, "Guest Alice");

      // 2. Provider confirms pending booking
      const confirmRes = await providerApi.confirmBooking(biz._id.toString(), bookingId);
      assert.strictEqual(confirmRes.success, true);
      assert.strictEqual(confirmRes.data.status, "confirmed");

      // 3. Provider marks confirmed booking as completed
      const completeRes = await providerApi.completeBooking(biz._id.toString(), bookingId);
      assert.strictEqual(completeRes.success, true);
      assert.strictEqual(completeRes.data.status, "completed");

      // 4. Cannot confirm or complete already completed booking
      await assert.rejects(
        () => providerApi.confirmBooking(biz._id.toString(), bookingId),
        (err) => err.status === 400
      );
    });

    it("3.2 Provider can reject pending booking with reason", async () => {
      const provider = await createAndLoginProvider("Reject Tester", "rejecttester@example.com");
      const biz = await createBusinessVenue(provider.id || provider._id, "Quick Nails");

      const svc = await Service.create({
        businessId: biz._id,
        name: "Manicure",
        price: 250,
        duration: 20,
        isActive: true,
      });

      const { token: customerToken } = await createCustomer("Guest Bob", "bobguest@example.com");
      setAccessToken(customerToken);

      const futureDate = new Date(Date.now() + 86400000 * 2).toISOString();
      const bookingRes = await bookingApi.create({
        businessId: biz._id.toString(),
        serviceId: svc._id.toString(),
        bookingDate: futureDate,
      });

      // Provider logs back in
      await authApi.login({ identifier: "rejecttester@example.com", password: "ProviderPassword123!" })
        .then((r) => setAccessToken(r.data.accessToken));

      // Reject booking with reason
      const rejectRes = await providerApi.rejectBooking(
        biz._id.toString(),
        bookingRes.data._id,
        "Staff fully booked for this timeslot"
      );
      assert.strictEqual(rejectRes.success, true);
      assert.strictEqual(rejectRes.data.status, "rejected");
      assert.strictEqual(rejectRes.data.cancellationReason, "Staff fully booked for this timeslot");
    });
  });

  describe("4. Provider Walk-in Queue Operations", () => {
    it("4.1 Should display active queue, call next customer FIFO, and complete entry", async () => {
      const provider = await createAndLoginProvider("Desk Manager", "deskmanager@example.com");
      const biz = await createBusinessVenue(provider.id || provider._id, "Fast Fade Barbers");

      // Two customers join queue
      const { token: cust1Token } = await createCustomer("Patron 1", "patron1@example.com");
      setAccessToken(cust1Token);
      await queueApi.join({ businessId: biz._id.toString() });

      const { token: cust2Token } = await createCustomer("Patron 2", "patron2@example.com");
      setAccessToken(cust2Token);
      await queueApi.join({ businessId: biz._id.toString() });

      // Provider logs back in
      await authApi.login({ identifier: "deskmanager@example.com", password: "ProviderPassword123!" })
        .then((r) => setAccessToken(r.data.accessToken));

      // 1. Get queue in FIFO order
      const queueRes = await providerApi.getBusinessQueue(biz._id.toString());
      assert.strictEqual(queueRes.success, true);
      assert.strictEqual(queueRes.data.length, 2);
      assert.strictEqual(queueRes.data[0].tokenDisplay, "Q-001");
      assert.strictEqual(queueRes.data[1].tokenDisplay, "Q-002");

      // 2. Call next customer (FIFO)
      const callNextRes = await providerApi.callNext(biz._id.toString());
      assert.strictEqual(callNextRes.success, true);
      assert.strictEqual(callNextRes.data.tokenDisplay, "Q-001");
      assert.strictEqual(callNextRes.data.status, "called");

      // 3. Complete currently called customer
      const completeRes = await providerApi.completeQueueEntry(biz._id.toString(), callNextRes.data._id);
      assert.strictEqual(completeRes.success, true);
      assert.strictEqual(completeRes.data.status, "completed");

      // 4. Call specific customer (Q-002)
      const callSpecificRes = await providerApi.callSpecific(biz._id.toString(), queueRes.data[1]._id);
      assert.strictEqual(callSpecificRes.success, true);
      assert.strictEqual(callSpecificRes.data.status, "called");

      // 5. Skip customer (Q-002)
      const skipRes = await providerApi.skipQueueEntry(
        biz._id.toString(),
        callSpecificRes.data._id,
        "Customer did not respond within grace period"
      );
      assert.strictEqual(skipRes.success, true);
      assert.strictEqual(skipRes.data.status, "skipped");
    });
  });

  describe("5. Business Profile Management", () => {
    it("5.1 Should retrieve and update owner business profile", async () => {
      const provider = await createAndLoginProvider("Profile Owner", "profileowner@example.com");
      const biz = await createBusinessVenue(provider.id || provider._id, "Original Business Name");

      const getRes = await providerApi.getBusinessProfile(biz._id.toString());
      assert.strictEqual(getRes.success, true);
      assert.strictEqual(getRes.data.business.name, "Original Business Name");

      // Update profile description and contact
      const updateRes = await providerApi.updateBusinessProfile(biz._id.toString(), {
        name: "Updated Business Name",
        description: "Brand new venue description",
        contact: {
          phone: "+919876500000",
          email: "updated@venue.com",
        },
      });

      assert.strictEqual(updateRes.success, true);
      assert.strictEqual(updateRes.data.business.name, "Updated Business Name");
      assert.strictEqual(updateRes.data.business.description, "Brand new venue description");
      assert.strictEqual(updateRes.data.business.contact.email, "updated@venue.com");
    });
  });
});
