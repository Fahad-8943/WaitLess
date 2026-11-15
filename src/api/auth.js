import { apiClient } from "./client.js";

export const authApi = {
  /**
   * Public login with email or phone identifier + password.
   */
  login: (credentials) =>
    apiClient("/auth/login", {
      method: "POST",
      body: credentials,
      skipAuth: true,
    }),

  /**
   * Public customer registration.
   */
  register: (userData) =>
    apiClient("/auth/register", {
      method: "POST",
      body: userData,
      skipAuth: true,
    }),

  /**
   * Single-session logout.
   */
  logout: () =>
    apiClient("/auth/logout", {
      method: "POST",
    }),

  /**
   * Revoke all active sessions for user.
   */
  logoutAll: () =>
    apiClient("/auth/logout-all", {
      method: "POST",
    }),

  /**
   * Fetch current authenticated user profile.
   */
  getMe: () =>
    apiClient("/auth/me", {
      method: "GET",
    }),

  /**
   * Update authenticated customer profile.
   */
  updateProfile: (data) =>
    apiClient("/auth/me", {
      method: "PATCH",
      body: data,
    }),
};

export const businessApi = {
  /**
   * Register a new business venue (elevates customer to provider role).
   */
  register: (businessData) =>
    apiClient("/businesses/register", {
      method: "POST",
      body: businessData,
    }),

  /**
   * List approved and active businesses for public discovery.
   */
  getPublicBusinesses: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.category && params.category !== "All" && params.category !== "All Categories") {
      qs.set("category", params.category);
    }
    if (params.search && params.search.trim()) {
      qs.set("search", params.search.trim());
    }
    if (params.page) {
      qs.set("page", String(params.page));
    }
    if (params.limit) {
      qs.set("limit", String(params.limit));
    }
    const query = qs.toString() ? `?${qs.toString()}` : "";
    return apiClient(`/businesses/public${query}`, { method: "GET" });
  },

  /**
   * Retrieve sanitized public profile for an approved business.
   */
  getPublicProfile: (businessId) =>
    apiClient(`/businesses/public/${businessId}`, {
      method: "GET",
    }),

  /**
   * Retrieve active services for a public business.
   */
  getPublicServices: (businessId) =>
    apiClient(`/businesses/public/${businessId}/services`, {
      method: "GET",
    }),
};

export const bookingApi = {
  /**
   * Customer creates a booking for an active service.
   */
  create: (bookingData) =>
    apiClient("/bookings", {
      method: "POST",
      body: bookingData,
    }),

  /**
   * Retrieve bookings created by authenticated customer.
   */
  getMyBookings: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.status) {
      qs.set("status", params.status);
    }
    if (params.page) {
      qs.set("page", String(params.page));
    }
    if (params.limit) {
      qs.set("limit", String(params.limit));
    }
    const query = qs.toString() ? `?${qs.toString()}` : "";
    return apiClient(`/bookings/my${query}`, { method: "GET" });
  },

  /**
   * Retrieve single booking details.
   */
  getById: (bookingId) =>
    apiClient(`/bookings/${bookingId}`, {
      method: "GET",
    }),

  /**
   * Cancel an eligible pending or confirmed booking.
   */
  cancel: (bookingId, reason = "") =>
    apiClient(`/bookings/${bookingId}/cancel`, {
      method: "PATCH",
      body: reason ? { reason } : {},
    }),
};

export const queueApi = {
  /**
   * Customer joins a business walk-in queue.
   */
  join: (queueData) =>
    apiClient("/queues/join", {
      method: "POST",
      body: queueData,
    }),

  /**
   * Retrieve active walk-in queue entries for customer across all venues.
   */
  getMyEntries: () =>
    apiClient("/queues/my", {
      method: "GET",
    }),

  /**
   * Retrieve single queue entry by ID with live position.
   */
  getById: (queueEntryId) =>
    apiClient(`/queues/${queueEntryId}`, {
      method: "GET",
    }),

  /**
   * Customer leaves an active walk-in queue.
   */
  leave: (queueEntryId, reason = "") =>
    apiClient(`/queues/${queueEntryId}/leave`, {
      method: "PATCH",
      body: reason ? { reason } : {},
    }),
};

export const providerApi = {
  /**
   * List all businesses owned by authenticated provider.
   */
  getMyBusinesses: () =>
    apiClient("/businesses/my/list", {
      method: "GET",
    }),

  /**
   * Aggregate dashboard overview across all provider-owned businesses.
   */
  getProviderOverview: () =>
    apiClient("/businesses/my/dashboard", {
      method: "GET",
    }),

  /**
   * Analytics and operational summary for a specific owned business.
   */
  getBusinessDashboard: (businessId) =>
    apiClient(`/businesses/${businessId}/dashboard`, {
      method: "GET",
    }),

  /**
   * Retrieve owner business profile.
   */
  getBusinessProfile: (businessId) =>
    apiClient(`/businesses/${businessId}`, {
      method: "GET",
    }),

  /**
   * Update owner business profile.
   */
  updateBusinessProfile: (businessId, data) =>
    apiClient(`/businesses/${businessId}`, {
      method: "PATCH",
      body: data,
    }),

  // Service Management
  getServices: (businessId) =>
    apiClient(`/businesses/${businessId}/services`, {
      method: "GET",
    }),

  createService: (businessId, serviceData) =>
    apiClient(`/businesses/${businessId}/services`, {
      method: "POST",
      body: serviceData,
    }),

  updateService: (businessId, serviceId, serviceData) =>
    apiClient(`/businesses/${businessId}/services/${serviceId}`, {
      method: "PATCH",
      body: serviceData,
    }),

  // Booking Management
  getBookings: (businessId, params = {}) => {
    const qs = new URLSearchParams();
    if (params.status && params.status !== "all") {
      qs.set("status", params.status);
    }
    if (params.date) {
      qs.set("date", params.date);
    }
    if (params.page) {
      qs.set("page", String(params.page));
    }
    if (params.limit) {
      qs.set("limit", String(params.limit));
    }
    const query = qs.toString() ? `?${qs.toString()}` : "";
    return apiClient(`/businesses/${businessId}/bookings${query}`, {
      method: "GET",
    });
  },

  confirmBooking: (businessId, bookingId) =>
    apiClient(`/businesses/${businessId}/bookings/${bookingId}/confirm`, {
      method: "PATCH",
    }),

  rejectBooking: (businessId, bookingId, reason = "") =>
    apiClient(`/businesses/${businessId}/bookings/${bookingId}/reject`, {
      method: "PATCH",
      body: reason ? { reason } : {},
    }),

  completeBooking: (businessId, bookingId) =>
    apiClient(`/businesses/${businessId}/bookings/${bookingId}/complete`, {
      method: "PATCH",
    }),

  cancelBooking: (businessId, bookingId, reason = "") =>
    apiClient(`/businesses/${businessId}/bookings/${bookingId}/cancel`, {
      method: "PATCH",
      body: reason ? { reason } : {},
    }),

  // Walk-in Queue Desk
  getBusinessQueue: (businessId, params = {}) => {
    const qs = new URLSearchParams();
    if (params.status) {
      qs.set("status", params.status);
    }
    const query = qs.toString() ? `?${qs.toString()}` : "";
    return apiClient(`/businesses/${businessId}/queue${query}`, {
      method: "GET",
    });
  },

  callNext: (businessId) =>
    apiClient(`/businesses/${businessId}/queue/call-next`, {
      method: "POST",
    }),

  callSpecific: (businessId, queueEntryId) =>
    apiClient(`/businesses/${businessId}/queue/${queueEntryId}/call`, {
      method: "PATCH",
    }),

  completeQueueEntry: (businessId, queueEntryId) =>
    apiClient(`/businesses/${businessId}/queue/${queueEntryId}/complete`, {
      method: "PATCH",
    }),

  skipQueueEntry: (businessId, queueEntryId, reason = "") =>
    apiClient(`/businesses/${businessId}/queue/${queueEntryId}/skip`, {
      method: "PATCH",
      body: reason ? { reason } : {},
    }),
};

export const adminApi = {
  /**
   * Platform-wide aggregated statistics across users, businesses, bookings, queues, and services.
   */
  getPlatformStats: () =>
    apiClient("/admin/stats", {
      method: "GET",
    }),

  /**
   * Paginated list of users with search and filter capabilities.
   */
  listUsers: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.page) qs.set("page", String(params.page));
    if (params.limit) qs.set("limit", String(params.limit));
    if (params.role && params.role !== "all") qs.set("role", params.role);
    if (params.isActive !== undefined && params.isActive !== null && params.isActive !== "" && params.isActive !== "all") {
      qs.set("isActive", String(params.isActive));
    }
    if (params.search && params.search.trim()) qs.set("search", params.search.trim());
    const query = qs.toString() ? `?${qs.toString()}` : "";
    return apiClient(`/admin/users${query}`, {
      method: "GET",
    });
  },

  /**
   * Platform Admin activates or deactivates a user account.
   */
  updateUserStatus: (userId, isActive) =>
    apiClient(`/admin/users/${userId}/status`, {
      method: "PATCH",
      body: { isActive: Boolean(isActive) },
    }),

  /**
   * Paginated list of businesses with search and lifecycle status filters.
   */
  listBusinesses: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.page) qs.set("page", String(params.page));
    if (params.limit) qs.set("limit", String(params.limit));
    if (params.approvalStatus && params.approvalStatus !== "all") {
      qs.set("approvalStatus", params.approvalStatus);
    }
    if (params.isActive !== undefined && params.isActive !== null && params.isActive !== "" && params.isActive !== "all") {
      qs.set("isActive", String(params.isActive));
    }
    if (params.category && params.category !== "All" && params.category !== "all") {
      qs.set("category", params.category);
    }
    if (params.search && params.search.trim()) qs.set("search", params.search.trim());
    const query = qs.toString() ? `?${qs.toString()}` : "";
    return apiClient(`/admin/businesses${query}`, {
      method: "GET",
    });
  },

  /**
   * Platform Admin approves a pending or rejected business venue.
   */
  approveBusiness: (businessId) =>
    apiClient(`/admin/businesses/${businessId}/approve`, {
      method: "PATCH",
    }),

  /**
   * Platform Admin rejects a business venue.
   */
  rejectBusiness: (businessId, reason = "") =>
    apiClient(`/admin/businesses/${businessId}/reject`, {
      method: "PATCH",
      body: reason ? { reason: reason.trim() } : {},
    }),

  /**
   * Platform Admin suspends a business venue.
   */
  suspendBusiness: (businessId, reason = "") =>
    apiClient(`/admin/businesses/${businessId}/suspend`, {
      method: "PATCH",
      body: reason ? { reason: reason.trim() } : {},
    }),

  /**
   * Platform Admin reactivates a suspended or deactivated business venue.
   */
  reactivateBusiness: (businessId) =>
    apiClient(`/admin/businesses/${businessId}/reactivate`, {
      method: "PATCH",
    }),

  /**
   * Retrieve business details for administrative inspection.
   */
  getBusinessDetails: (businessId) =>
    apiClient(`/businesses/${businessId}`, {
      method: "GET",
    }),

  /**
   * Retrieve business services for administrative inspection.
   */
  getBusinessServices: (businessId) =>
    apiClient(`/businesses/${businessId}/services`, {
      method: "GET",
    }),
};

