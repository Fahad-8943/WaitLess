import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./contextCore";
import { authApi } from "../api/auth";
import {
  setAccessToken,
  getAccessToken,
  refreshAuthToken,
  onAuthExpired,
} from "../api/client";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  /**
   * Helper to resolve the appropriate dashboard path for a given user role.
   */
  const getDashboardPath = useCallback((role) => {
    switch (role) {
      case "admin":
        return "/admin/dashboard";
      case "provider":
        return "/business/dashboard";
      case "customer":
      default:
        return "/user/dashboard";
    }
  }, []);

  /**
   * Attempt session restoration.
   * Leverages the httpOnly refreshToken cookie via /auth/refresh, then fetches profile via /auth/me.
   */
  const restoreSession = useCallback(async () => {
    try {
      const newToken = await refreshAuthToken();
      if (newToken) {
        const response = await authApi.getMe();
        if (response?.data?.user) {
          setUser(response.data.user);
          return response.data.user;
        }
      }
      setUser(null);
      setAccessToken(null);
      return null;
    } catch {
      setUser(null);
      setAccessToken(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      try {
        const newToken = await refreshAuthToken();
        if (newToken && isMounted) {
          const response = await authApi.getMe();
          if (isMounted && response?.data?.user) {
            setUser(response.data.user);
          }
        }
      } catch {
        if (isMounted) {
          setUser(null);
          setAccessToken(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initSession();

    // Subscribe to session expiration events triggered by apiClient
    const unsubscribe = onAuthExpired(() => {
      if (isMounted) {
        setUser(null);
        setAccessToken(null);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  /**
   * Log in user using email or phone identifier and password.
   */
  const login = useCallback(async ({ identifier, password }) => {
    setAuthError(null);
    try {
      const response = await authApi.login({ identifier, password });
      const { user: loggedInUser, accessToken } = response.data;

      setAccessToken(accessToken);
      setUser(loggedInUser);
      return loggedInUser;
    } catch (err) {
      setAuthError(err.message || "Failed to log in");
      throw err;
    }
  }, []);

  /**
   * Register a new customer account.
   */
  const register = useCallback(async (userData) => {
    setAuthError(null);
    try {
      const response = await authApi.register(userData);
      const { user: registeredUser, accessToken } = response.data;

      setAccessToken(accessToken);
      setUser(registeredUser);
      return registeredUser;
    } catch (err) {
      setAuthError(err.message || "Failed to create account");
      throw err;
    }
  }, []);

  /**
   * Cleanly logout current session.
   */
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      setAccessToken(null);
      setUser(null);
      setAuthError(null);
    }
  }, []);

  /**
   * Update authenticated customer profile state in memory.
   */
  const updateUser = useCallback((updatedUserData) => {
    setUser((prev) => (prev ? { ...prev, ...updatedUserData } : updatedUserData));
  }, []);

  /**
   * Elevate user role to provider after successful business registration.
   * Updates in-memory access token and synchronizes user state.
   */
  const elevateToProvider = useCallback((newAccessToken, updatedUserData = {}) => {
    if (newAccessToken) {
      setAccessToken(newAccessToken);
    }

    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        ...updatedUserData,
        role: "provider",
      };
    });

    // Refresh profile in background to ensure complete server synchronization
    authApi
      .getMe()
      .then((res) => {
        if (res?.data?.user) {
          setUser(res.data.user);
        }
      })
      .catch((err) => {
        console.warn("Failed to synchronize elevated profile:", err);
      });
  }, []);

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    authError,
    setAuthError,
    login,
    register,
    logout,
    restoreSession,
    elevateToProvider,
    updateUser,
    getDashboardPath,
    getAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

