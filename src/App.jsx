import "./App.css";
import { Routes, Route, Navigate, Link, useLocation } from "react-router";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import Landing from "./pages/public/page/Landing";
import Login from "./pages/public/page/Login";
import Register from "./pages/public/page/Register";
import BusinessRegister from "./pages/public/page/BusinessRegister";
import Discover from "./pages/public/page/Discover";
import PublicBusinessDetails from "./pages/public/page/BusinessDetails";
import Unauthorized from "./pages/public/page/Unauthorized";

// Customer Pages
import UserDashboard from "./pages/users/page/Dashboard";
import UserBookings from "./pages/users/page/Bookings";
import UserQueue from "./pages/users/page/Queue";
import UserHistory from "./pages/users/page/History";
import UserProfile from "./pages/users/page/Profile";

// Business Owner Pages
import BusinessDashboard from "./pages/business/page/Dashboard";
import BusinessProfile from "./pages/business/page/Profile";
import BusinessServices from "./pages/business/page/Services";
import BusinessBookings from "./pages/business/page/Bookings";
import BusinessQueue from "./pages/business/page/Queue";
import BusinessReviews from "./pages/business/page/Reviews";

// Platform Admin Pages
import AdminDashboard from "./pages/admin/page/Dashboard";
import AdminBusinesses from "./pages/admin/page/Businesses";
import AdminBusinessDetails from "./pages/admin/page/BusinessDetails";
import AdminUsers from "./pages/admin/page/Users";
import AdminReviews from "./pages/admin/page/Reviews";
import AdminSettings from "./pages/admin/page/Settings";

function NotFound() {
  const { pathname } = useLocation();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold text-[#2563EB]">404 · Page not found</p>
      <h1 className="mt-2 text-3xl font-extrabold">We couldn’t find that page</h1>
      <p className="mt-2 text-sm text-[#64748B]">No page is configured at <code>{pathname}</code>.</p>
      <Link to="/" className="mt-6 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white">Go to homepage</Link>
    </main>
  );
}

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/business-register"
        element={
          <ProtectedRoute allowedRoles={["customer", "provider", "admin"]}>
            <BusinessRegister />
          </ProtectedRoute>
        }
      />
      <Route path="/discover" element={<Discover />} />
      <Route path="/business/:businessId" element={<PublicBusinessDetails />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Customer Routes (Customer, Provider, Admin) */}
      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute allowedRoles={["customer", "provider", "admin"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/bookings"
        element={
          <ProtectedRoute allowedRoles={["customer", "provider", "admin"]}>
            <UserBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/queue"
        element={
          <ProtectedRoute allowedRoles={["customer", "provider", "admin"]}>
            <UserQueue />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/history"
        element={
          <ProtectedRoute allowedRoles={["customer", "provider", "admin"]}>
            <UserHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/profile"
        element={
          <ProtectedRoute allowedRoles={["customer", "provider", "admin"]}>
            <UserProfile />
          </ProtectedRoute>
        }
      />

      {/* Business Owner Routes (Provider and Admin only; Customers forbidden) */}
      <Route
        path="/business/dashboard"
        element={
          <ProtectedRoute allowedRoles={["provider", "admin"]}>
            <BusinessDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/business/profile"
        element={
          <ProtectedRoute allowedRoles={["provider", "admin"]}>
            <BusinessProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/business/services"
        element={
          <ProtectedRoute allowedRoles={["provider", "admin"]}>
            <BusinessServices />
          </ProtectedRoute>
        }
      />
      <Route
        path="/business/bookings"
        element={
          <ProtectedRoute allowedRoles={["provider", "admin"]}>
            <BusinessBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/business/queue"
        element={
          <ProtectedRoute allowedRoles={["provider", "admin"]}>
            <BusinessQueue />
          </ProtectedRoute>
        }
      />
      <Route
        path="/business/reviews"
        element={
          <ProtectedRoute allowedRoles={["provider", "admin"]}>
            <BusinessReviews />
          </ProtectedRoute>
        }
      />

      {/* Platform Admin Routes (Admin only; Customers and Providers forbidden) */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/businesses"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminBusinesses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/businesses/:businessId"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminBusinessDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reviews"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminReviews />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminSettings />
          </ProtectedRoute>
        }
      />

      {/* Convenience Navigation Redirects */}
      <Route path="/business" element={<Navigate to="/business/dashboard" replace />} />
      <Route path="/user" element={<Navigate to="/user/dashboard" replace />} />
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
