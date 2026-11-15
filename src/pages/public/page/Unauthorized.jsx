import { Link, useLocation } from "react-router";
import { useAuth } from "../../../context/AuthContext";

export default function Unauthorized() {
  const { state } = useLocation();
  const { user, getDashboardPath } = useAuth();

  const attemptedPath = state?.from?.pathname || "this page";
  const userRole = user?.role || "guest";
  const destination = user ? getDashboardPath(user.role) : "/login";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-[#F8FAFC]">
      <p className="text-sm font-semibold text-amber-600">403 · Access Denied</p>
      <h1 className="mt-2 text-3xl font-extrabold text-[#111827]">
        Restricted Area
      </h1>
      <p className="mt-2 text-sm text-[#64748B] max-w-md">
        Your account role <span className="font-semibold text-[#111827]">({userRole})</span> is not authorized to access <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs text-slate-800">{attemptedPath}</code>.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          to={destination}
          className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-2xs"
        >
          {user ? "Go to your dashboard" : "Sign in with another account"}
        </Link>
        <Link
          to="/"
          className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-semibold text-[#111827] hover:bg-slate-50 transition-colors shadow-2xs"
        >
          Homepage
        </Link>
      </div>
    </main>
  );
}
