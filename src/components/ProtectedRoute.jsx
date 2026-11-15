import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

/**
 * Route protection wrapper enforcing authentication and role-based access control (RBAC).
 *
 * @param {Object} props
 * @param {Array<string>} [props.allowedRoles] - Roles permitted to access the child route
 * @param {React.ReactNode} props.children - Protected component to render
 */
export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#2563EB] border-t-transparent" />
          <p className="text-xs font-semibold text-[#64748B]">Verifying session...</p>
        </div>
      </div>
    );
  }

  // 1. Unauthenticated users are redirected to login with return target state
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Role-based access control
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" state={{ from: location, requiredRoles: allowedRoles }} replace />;
  }

  return children;
}
