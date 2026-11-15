import { useState, useEffect } from "react";
import logo from "../../../../src/assets/logo.png";
import { Link, useSearchParams, useNavigate, useLocation } from "react-router";
import { useAuth } from "../../../context/AuthContext";

function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, isAuthenticated, isLoading, getDashboardPath } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // If already authenticated, redirect to target or appropriate dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const destination = location.state?.from?.pathname || getDashboardPath(user.role);
      navigate(destination, { replace: true });
    }
  }, [isLoading, isAuthenticated, user, navigate, location.state, getDashboardPath]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!identifier.trim()) {
      setErrorMessage("Email address or phone number is required");
      return;
    }

    if (!password) {
      setErrorMessage("Password is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const loggedInUser = await login({
        identifier: identifier.trim(),
        password,
      });

      const destination = location.state?.from?.pathname || getDashboardPath(loggedInUser.role);
      navigate(destination, { replace: true });
    } catch (err) {
      setErrorMessage(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center px-4 py-12 sm:px-6">
      {/* WaitLess Branding */}
      <div className="mb-6 text-center">
        <Link
          to="/"
          className="inline-block bg-[#3730A3] p-2.5 rounded-xl shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#06B6D4]"
          aria-label="WaitLess Home"
        >
          <img
            src={logo}
            alt="WaitLess Logo"
            className="h-8 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-sm bg-white rounded-xl border border-[#E2E8F0] shadow-2xs p-6 sm:p-7">
        <h1 className="text-xl font-bold text-[#111827] text-center">
          Sign In to WaitLess
        </h1>
        <p className="text-xs text-[#64748B] text-center mt-1">
          Access your bookings and live queues
        </p>

        {searchParams.get("reset") === "true" && (
          <p role="status" className="mt-4 rounded-lg bg-blue-50 p-3 text-xs text-blue-800 border border-blue-100">
            Password reset is not available yet. Please contact support for help.
          </p>
        )}

        {errorMessage && (
          <div
            role="alert"
            className="mt-4 rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200"
          >
            {errorMessage}
          </div>
        )}

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          {/* Email or Phone */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-[#111827] mb-1"
            >
              Email Address or Phone
            </label>
            <input
              type="text"
              id="email"
              name="email"
              autoComplete="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="name@example.com or phone"
              disabled={isSubmitting}
              className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors disabled:opacity-60"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-[#111827] mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isSubmitting}
              className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors disabled:opacity-60"
            />
          </div>

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer text-[#64748B]">
              <input
                type="checkbox"
                name="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-[#E2E8F0] text-[#2563EB] focus:ring-[#2563EB]"
              />
              <span>Remember me</span>
            </label>

            <Link
              to="/login?reset=true"
              className="text-[#2563EB] hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-[#2563EB] hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg text-xs transition-colors shadow-2xs flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* Link to Register */}
        <div className="mt-5 pt-4 border-t border-[#E2E8F0] text-center text-xs text-[#64748B]">
          <span>Don't have an account? </span>
          <Link
            to="/register"
            className="text-[#2563EB] hover:underline font-semibold"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
