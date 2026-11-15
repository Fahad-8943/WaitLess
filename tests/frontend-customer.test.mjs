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

describe("WaitLess — Frontend Batch 2: Customer Functionality Test Suite", () => {
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

  // Helper to create test customer & log in
  async function createAndLoginCustomer(
    name = "Jane Customer",
    email = "jane@example.com",
    phone = `+9198${Math.floor(10000000 + Math.random() * 90000000)}`
  ) {
    const registerRes = await authApi.register({
      name,
      email,
      phone,
      password: "CustomerPassword123!",
    });
    setAccessToken(registerRes.data.accessToken);
    return registerRes.data.user;
  }

  // Helper to create approved business & active services
  async function createApprovedBusinessWithServices() {
    const providerRes = await authApi.register({
      name: "Salon Owner",
      email: "salon@example.com",
      phone: "+919123456789",
      password: "ProviderPassword123!",
    });
    setAccessToken(providerRes.data.accessToken);

    const bizDoc = await Business.create({
      name: "Crown & Blade Studio",
      category: "Barbers & Salons",
      description: "Premier grooming venue in Bangalore",
      ownerId: providerRes.data.user.id || providerRes.data.user._id,
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

    const svc1 = await Service.create({
      businessId: bizDoc._id,
      name: "Signature Haircut",
      description: "Precision haircut and styling",
      price: 350,
      duration: 30,
      isActive: true,
    });

    const svc2 = await Service.create({
      businessId: bizDoc._id,
      name: "Beard Sculpt",
      description: "Hot towel & beard sculpt",
      price: 200,
      duration: 15,
      isActive: true,
    });

    // Reset auth token to clean slate
    setAccessToken(null);

    return { business: bizDoc, services: [svc1, svc2] };
  }

  describe("1. Business Discovery Endpoints", () => {
    it("1.1 Should list public approved businesses with pagination", async () => {
      const { business } = await createApprovedBusinessWithServices();

      const res = await businessApi.getPublicBusinesses({ page: 1, limit: 10 });
      assert.strictEqual(res.success, true);
      assert.ok(Array.isArray(res.data.businesses));
      assert.strictEqual(res.data.businesses.length, 1);
      assert.strictEqual(res.data.businesses[0].name, "Crown & Blade Studio");
      assert.strictEqual(res.data.businesses[0]._id, business._id.toString());
      assert.strictEqual(res.data.pagination.page, 1);
      assert.strictEqual(res.data.pagination.total, 1);
    });

    it("1.2 Should filter businesses by category and search term (name or city)", async () => {
      await createApprovedBusinessWithServices();

      // Matching category
      const catMatch = await businessApi.getPublicBusinesses({ category: "Barbers & Salons" });
      assert.strictEqual(catMatch.data.businesses.length, 1);

      // Non-matching category
      const catMiss = await businessApi.getPublicBusinesses({ category: "Dining & Cafes" });
      assert.strictEqual(catMiss.data.businesses.length, 0);

      // Search matching city
      const cityMatch = await businessApi.getPublicBusinesses({ search: "Bangalore" });
      assert.strictEqual(cityMatch.data.businesses.length, 1);

      // Search non-matching
      const noMatch = await businessApi.getPublicBusinesses({ search: "NonExistentCityXYZ" });
      assert.strictEqual(noMatch.data.businesses.length, 0);
    });

    it("1.3 Should retrieve public business profile and active services", async () => {
      const { business, services } = await createApprovedBusinessWithServices();

      const profileRes = await businessApi.getPublicProfile(business._id.toString());
      assert.strictEqual(profileRes.success, true);
      assert.strictEqual(profileRes.data.business.name, "Crown & Blade Studio");
      // Verify internal fields are not leaked
      assert.strictEqual(profileRes.data.business.ownerId, undefined);
      assert.strictEqual(profileRes.data.business.approvalStatus, undefined);

      const servicesRes = await businessApi.getPublicServices(business._id.toString());
      assert.strictEqual(servicesRes.success, true);
      assert.strictEqual(servicesRes.data.services.length, 2);
      assert.strictEqual(servicesRes.data.services[0].name, services[1].name); // sorted by price asc
    });
  });

  describe("2. Customer Profile Management", () => {
    it("2.1 Should fetch authenticated customer profile", async () => {
      const customer = await createAndLoginCustomer("Alice Walker", "alice@example.com");

      const res = await authApi.getMe();
      assert.strictEqual(res.success, true);
      assert.strictEqual(res.data.user.name, "Alice Walker");
      assert.strictEqual(res.data.user.email, "alice@example.com");
      assert.strictEqual(res.data.user.role, "customer");
    });

    it("2.2 Should update customer profile name and phone", async () => {
      await createAndLoginCustomer("Alice Walker", "alice@example.com");

      const updateRes = await authApi.updateProfile({
        name: "Alice M. Walker",
        phone: "+919988776655",
      });

      assert.strictEqual(updateRes.success, true);
      assert.strictEqual(updateRes.data.user.name, "Alice M. Walker");
      assert.strictEqual(updateRes.data.user.phone, "+919988776655");
      // Email remains unchanged
      assert.strictEqual(updateRes.data.user.email, "alice@example.com");
    });

    it("2.3 Should reject updates containing forbidden fields (role, passwordHash)", async () => {
      await createAndLoginCustomer("Alice Walker", "alice@example.com");

      await assert.rejects(
        async () => {
          await authApi.updateProfile({
            name: "Hacker Attempt",
            role: "admin",
          });
        },
        (err) => {
          assert.ok(err instanceof ApiError);
          assert.strictEqual(err.status, 400);
          return true;
        }
      );
    });
  });

  describe("3. Customer Bookings Flow", () => {
    it("3.1 Customer creates a booking for an active service with future date", async () => {
      const customer = await createAndLoginCustomer("Bob Martin", "bob@example.com");
      const { business, services } = await createApprovedBusinessWithServices();

      // Log back in as customer
      await authApi.login({ identifier: "bob@example.com", password: "CustomerPassword123!" })
        .then((r) => setAccessToken(r.data.accessToken));

      const futureDate = new Date(Date.now() + 86400000 * 2).toISOString(); // 2 days in future
      const bookingRes = await bookingApi.create({
        businessId: business._id.toString(),
        serviceId: services[0]._id.toString(),
        bookingDate: futureDate,
        notes: "Please allocate quiet station",
      });

      assert.strictEqual(bookingRes.success, true);
      assert.ok(bookingRes.data._id);
      assert.strictEqual(bookingRes.data.status, "pending");
      assert.strictEqual(bookingRes.data.serviceSnapshot.name, "Signature Haircut");
    });

    it("3.2 Should reject bookings with past dates", async () => {
      await createAndLoginCustomer("Bob Martin", "bob@example.com");
      const { business, services } = await createApprovedBusinessWithServices();

      await authApi.login({ identifier: "bob@example.com", password: "CustomerPassword123!" })
        .then((r) => setAccessToken(r.data.accessToken));

      const pastDate = new Date(Date.now() - 86400000).toISOString(); // 1 day in past
      await assert.rejects(
        async () => {
          await bookingApi.create({
            businessId: business._id.toString(),
            serviceId: services[0]._id.toString(),
            bookingDate: pastDate,
          });
        },
        (err) => {
          assert.ok(err instanceof ApiError);
          assert.strictEqual(err.status, 400);
          return true;
        }
      );
    });

    it("3.3 Customer can retrieve own bookings and cancel an eligible pending booking", async () => {
      await createAndLoginCustomer("Bob Martin", "bob@example.com");
      const { business, services } = await createApprovedBusinessWithServices();

      await authApi.login({ identifier: "bob@example.com", password: "CustomerPassword123!" })
        .then((r) => setAccessToken(r.data.accessToken));

      const futureDate = new Date(Date.now() + 86400000).toISOString();
      const createRes = await bookingApi.create({
        businessId: business._id.toString(),
        serviceId: services[0]._id.toString(),
        bookingDate: futureDate,
      });

      const bookingId = createRes.data._id;

      // Verify retrieval in list
      const listRes = await bookingApi.getMyBookings();
      assert.strictEqual(listRes.success, true);
      assert.strictEqual(listRes.data.length, 1);
      assert.strictEqual(listRes.data[0]._id, bookingId);

      // Cancel booking
      const cancelRes = await bookingApi.cancel(bookingId, "Schedule conflict");
      assert.strictEqual(cancelRes.success, true);
      assert.strictEqual(cancelRes.data.status, "cancelled");

      // Verify cannot cancel twice
      await assert.rejects(
        async () => {
          await bookingApi.cancel(bookingId, "Second cancel attempt");
        },
        (err) => {
          assert.ok(err instanceof ApiError);
          assert.strictEqual(err.status, 400);
          return true;
        }
      );
    });
  });

  describe("4. Customer Walk-in Queue Flow", () => {
    it("4.1 Customer joins walk-in queue and receives token with live position", async () => {
      await createAndLoginCustomer("Charlie Brown", "charlie@example.com");
      const { business, services } = await createApprovedBusinessWithServices();

      await authApi.login({ identifier: "charlie@example.com", password: "CustomerPassword123!" })
        .then((r) => setAccessToken(r.data.accessToken));

      const joinRes = await queueApi.join({
        businessId: business._id.toString(),
        serviceId: services[0]._id.toString(),
        notes: "First time visitor",
      });

      assert.strictEqual(joinRes.success, true);
      assert.strictEqual(joinRes.data.tokenNumber, 1);
      assert.strictEqual(joinRes.data.tokenDisplay, "Q-001");
      assert.strictEqual(joinRes.data.status, "waiting");
      assert.strictEqual(joinRes.data.position, 1);
    });

    it("4.2 Should reject duplicate queue entry for the same business", async () => {
      await createAndLoginCustomer("Charlie Brown", "charlie@example.com");
      const { business, services } = await createApprovedBusinessWithServices();

      await authApi.login({ identifier: "charlie@example.com", password: "CustomerPassword123!" })
        .then((r) => setAccessToken(r.data.accessToken));

      await queueApi.join({
        businessId: business._id.toString(),
        serviceId: services[0]._id.toString(),
      });

      // Second join attempt for same venue
      await assert.rejects(
        async () => {
          await queueApi.join({
            businessId: business._id.toString(),
            serviceId: services[0]._id.toString(),
          });
        },
        (err) => {
          assert.ok(err instanceof ApiError);
          assert.strictEqual(err.status, 409);
          return true;
        }
      );
    });

    it("4.3 Customer retrieves active entries and leaves queue successfully", async () => {
      await createAndLoginCustomer("Charlie Brown", "charlie@example.com");
      const { business } = await createApprovedBusinessWithServices();

      await authApi.login({ identifier: "charlie@example.com", password: "CustomerPassword123!" })
        .then((r) => setAccessToken(r.data.accessToken));

      const joinRes = await queueApi.join({
        businessId: business._id.toString(),
      });

      const entryId = joinRes.data._id;

      // Verify active entries list
      const myEntriesRes = await queueApi.getMyEntries();
      assert.strictEqual(myEntriesRes.success, true);
      assert.strictEqual(myEntriesRes.data.length, 1);
      assert.strictEqual(myEntriesRes.data[0]._id.toString(), entryId.toString());

      // Leave queue
      const leaveRes = await queueApi.leave(entryId.toString(), "Changed mind");
      assert.strictEqual(leaveRes.success, true);
      assert.strictEqual(leaveRes.data.status, "cancelled");

      // Verify active entries list is now empty
      const afterLeaveRes = await queueApi.getMyEntries();
      assert.strictEqual(afterLeaveRes.data.length, 0);
    });

    it("4.4 Should reject queue join when venue reaches maximum queue capacity", async () => {
      const { business } = await createApprovedBusinessWithServices();

      // Set business maxQueueCapacity to 1 for test
      await Business.findByIdAndUpdate(business._id, {
        "policies.maxQueueCapacity": 1,
      });

      // Customer 1 fills the queue
      await createAndLoginCustomer("Customer One", "one@example.com");
      await queueApi.join({ businessId: business._id.toString() });

      // Customer 2 tries to join full queue
      await createAndLoginCustomer("Customer Two", "two@example.com");
      await assert.rejects(
        async () => {
          await queueApi.join({ businessId: business._id.toString() });
        },
        (err) => {
          assert.ok(err instanceof ApiError);
          assert.strictEqual(err.status, 400);
          assert.strictEqual(err.code, "QUEUE_CAPACITY_EXCEEDED");
          return true;
        }
      );
    });
  });

  describe("5. Unauthorized Access Protection", () => {
    it("5.1 Unauthenticated requests to customer operations return 401 Unauthorized", async () => {
      setAccessToken(null);

      await assert.rejects(
        () => authApi.getMe(),
        (err) => err.status === 401
      );

      await assert.rejects(
        () => bookingApi.getMyBookings(),
        (err) => err.status === 401
      );

      await assert.rejects(
        () => queueApi.getMyEntries(),
        (err) => err.status === 401
      );
    });
  });

  describe("6. Business Registration Location Coordinates Validation", () => {
    it("6.1 Submits real entered coordinates and elevates customer to provider", async () => {
      await createAndLoginCustomer("Venue Owner", "owner@example.com");

      const payload = {
        name: "Metro Wellness Center",
        category: "Health & Clinics",
        description: "Holistic physiotherapy clinic",
        address: {
          street: "100 Indiranagar 100ft Rd",
          city: "Bangalore",
          state: "Karnataka",
          postalCode: "560038",
          country: "IN",
        },
        location: {
          type: "Point",
          coordinates: [77.6408, 12.9784], // [lng, lat]
        },
        timezone: "Asia/Kolkata",
        operatingHours: [
          { dayOfWeek: 1, openTime: "09:00", closeTime: "20:00", isClosed: false },
        ],
        policies: {
          maxQueueCapacity: 50,
          remoteQueueEnabled: true,
          gracePeriodMinutes: 10,
        },
      };

      const res = await businessApi.register(payload);
      assert.strictEqual(res.success, true);
      assert.strictEqual(res.data.business.name, "Metro Wellness Center");
      assert.deepStrictEqual(res.data.business.location.coordinates, [77.6408, 12.9784]);
    });

    it("6.2 Rejects fabricated or out-of-range coordinates", async () => {
      await createAndLoginCustomer("Invalid Coords Owner", "invalidcoords@example.com");

      const payload = {
        name: "Broken Coords Clinic",
        category: "Health & Clinics",
        address: {
          street: "123 Anywhere",
          city: "Nowhere",
          state: "State",
          postalCode: "123456",
          country: "IN",
        },
        location: {
          type: "Point",
          coordinates: [200.0, 95.0], // Out of bounds longitude > 180 and latitude > 90
        },
        timezone: "Asia/Kolkata",
        operatingHours: [
          { dayOfWeek: 1, openTime: "09:00", closeTime: "20:00", isClosed: false },
        ],
      };

      await assert.rejects(
        () => businessApi.register(payload),
        (err) => {
          assert.ok(err instanceof ApiError);
          assert.strictEqual(err.status, 400);
          return true;
        }
      );
    });
  });
});
