/**
 * Centralized Native Fetch API Client for WaitLess
 * 
 * Enforces:
 * - Environment-driven centralized base URL
 * - JSON request/response handling
 * - Standardized error extraction (ApiError)
 * - Cookie inclusion (credentials: 'include')
 * - CSRF defense custom header (X-Requested-With: XMLHttpRequest)
 * - In-memory access token storage
 * - Atomic single-flight refresh token rotation lock
 * - Single-retry on 401 Unauthorized for eligible requests
 * - Clean session expiration event handling
 */

export class ApiError extends Error {
  constructor(status, code, message, details = null, raw = null) {
    super(message || "An unexpected error occurred");
    this.name = "ApiError";
    this.status = status;
    this.code = code || "INTERNAL_ERROR";
    this.details = details;
    this.raw = raw;
  }
}

export const getBaseUrl = () => {
  const raw =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
    globalThis.process?.env?.VITE_API_URL ||
    "http://localhost:5000/api/v1";
  return raw.replace(/\/+$/, "");
};

export const API_BASE_URL = getBaseUrl();

// In-memory access token (refresh token is strictly httpOnly cookie)
let inMemoryAccessToken = null;
let refreshPromise = null;
const authExpiredListeners = new Set();

export const getAccessToken = () => inMemoryAccessToken;

export const setAccessToken = (token) => {
  inMemoryAccessToken = token || null;
};

export const onAuthExpired = (callback) => {
  authExpiredListeners.add(callback);
  return () => authExpiredListeners.delete(callback);
};

export const notifyAuthExpired = (error) => {
  authExpiredListeners.forEach((cb) => {
    try {
      cb(error);
    } catch (err) {
      console.error("AuthExpired listener threw:", err);
    }
  });
};

/**
 * Handle authentication refresh using the backend refresh endpoint (/auth/refresh).
 * Prevents multiple simultaneous refresh requests by reusing the in-flight refreshPromise.
 */
export const refreshAuthToken = async () => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const response = await fetch(`${getBaseUrl()}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        credentials: "include",
      });

      let responseData = null;
      try {
        responseData = await response.json();
      } catch {
        responseData = null;
      }

      if (!response.ok || !responseData?.success) {
        const error = new ApiError(
          response.status,
          responseData?.error?.code || "SESSION_EXPIRED",
          responseData?.error?.message || "Session has expired or refresh token is invalid",
          responseData?.error?.details,
          responseData
        );
        setAccessToken(null);
        notifyAuthExpired(error);
        throw error;
      }

      const newAccessToken = responseData.data?.accessToken;
      if (!newAccessToken) {
        const error = new ApiError(
          500,
          "MALFORMED_AUTH_RESPONSE",
          "Access token missing in refresh response",
          null,
          responseData
        );
        setAccessToken(null);
        notifyAuthExpired(error);
        throw error;
      }

      setAccessToken(newAccessToken);
      return newAccessToken;
    } catch (error) {
      setAccessToken(null);
      throw error;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

/**
 * Native fetch API client with automatic token attachment, CSRF header,
 * response parsing, and transparent single-retry on 401 token expiration.
 */
export const apiClient = async (endpoint, options = {}) => {
  const {
    method = "GET",
    headers = {},
    body = null,
    skipAuth = false,
    _retry = false,
    ...restOptions
  } = options;

  const url = endpoint.startsWith("http://") || endpoint.startsWith("https://")
    ? endpoint
    : `${getBaseUrl()}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const requestHeaders = {
    "X-Requested-With": "XMLHttpRequest",
    ...headers,
  };

  // Attach Authorization header if access token exists and skipAuth is not true
  if (!skipAuth && inMemoryAccessToken && !requestHeaders["Authorization"]) {
    requestHeaders["Authorization"] = `Bearer ${inMemoryAccessToken}`;
  }

  let requestBody = body;
  if (
    body &&
    typeof body === "object" &&
    !(body instanceof FormData) &&
    !(body instanceof Blob)
  ) {
    requestHeaders["Content-Type"] = "application/json";
    requestBody = JSON.stringify(body);
  }

  const fetchOptions = {
    method,
    headers: requestHeaders,
    body: requestBody,
    credentials: "include",
    ...restOptions,
  };

  let response;
  try {
    response = await fetch(url, fetchOptions);
  } catch (networkError) {
    throw new ApiError(
      0,
      "NETWORK_ERROR",
      networkError.message || "Failed to communicate with WaitLess server",
      null,
      networkError
    );
  }

  // Handle 401 Token Expiration with transparent token refresh & single retry
  const isAuthEndpoint =
    endpoint.includes("/auth/login") ||
    endpoint.includes("/auth/register") ||
    endpoint.includes("/auth/refresh");

  if (response.status === 401 && !skipAuth && !_retry && !isAuthEndpoint) {
    try {
      const newToken = await refreshAuthToken();
      // Retry the original request once with the new access token
      return apiClient(endpoint, {
        ...options,
        _retry: true,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newToken}`,
        },
      });
    } catch (refreshError) {
      // Refresh failed: session is expired or revoked.
      setAccessToken(null);
      notifyAuthExpired(refreshError);
      throw refreshError;
    }
  }

  // Parse response
  let data = null;
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else if (response.status !== 204) {
    try {
      data = await response.text();
    } catch {
      data = null;
    }
  }

  if (!response.ok || (data && typeof data === "object" && data.success === false)) {
    const errorDetails = data?.error?.details || null;
    const errorCode = data?.error?.code || `HTTP_${response.status}`;
    const errorMessage =
      data?.error?.message ||
      (typeof data === "string" ? data : response.statusText) ||
      "Request failed";

    throw new ApiError(response.status, errorCode, errorMessage, errorDetails, data);
  }

  return data;
};
