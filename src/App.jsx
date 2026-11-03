import "./App.css";
import { Routes, Route, Navigate, Link, useLocation } from "react-router";

// Public Pages
import Landing from "./pages/public/page/Landing";
import Login from "./pages/public/page/Login";
import Register from "./pages/public/page/Register";
import BusinessRegister from "./pages/public/page/BusinessRegister";
import Discover from "./pages/public/page/Discover";
import PublicBusinessDetails from "./pages/public/page/BusinessDetails";

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
      <Route path="/business-register" element={<BusinessRegister />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/business/:businessId" element={<PublicBusinessDetails />} />

      {/* Customer Routes */}
      <Route path="/user/dashboard" element={<UserDashboard />} />
      <Route path="/user/bookings" element={<UserBookings />} />
      <Route path="/user/queue" element={<UserQueue />} />
      <Route path="/user/history" element={<UserHistory />} />
      <Route path="/user/profile" element={<UserProfile />} />

      {/* Business Owner Routes */}
      <Route path="/business/dashboard" element={<BusinessDashboard />} />
      <Route path="/business/profile" element={<BusinessProfile />} />
      <Route path="/business/services" element={<BusinessServices />} />
      <Route path="/business/bookings" element={<BusinessBookings />} />
      <Route path="/business/queue" element={<BusinessQueue />} />
      <Route path="/business/reviews" element={<BusinessReviews />} />

      {/* Platform Admin Routes */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/businesses" element={<AdminBusinesses />} />
      <Route path="/admin/businesses/:businessId" element={<AdminBusinessDetails />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/reviews" element={<AdminReviews />} />
      <Route path="/admin/settings" element={<AdminSettings />} />
      <Route path="/business" element={<Navigate to="/business/dashboard" replace />} />
      <Route path="/user" element={<Navigate to="/user/dashboard" replace />} />
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
