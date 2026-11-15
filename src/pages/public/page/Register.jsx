import { useState, useEffect } from "react";
import logo from "../../../../src/assets/logo.png";
import { Link, useNavigate, useLocation } from "react-router";
import { useAuth } from "../../../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, user, isAuthenticated, isLoading, getDashboardPath } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // If already authenticated, redirect
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const destination = location.state?.from?.pathname || getDashboardPath(user.role);
      navigate(destination, { replace: true });
    }
  }, [isLoading, isAuthenticated, user, navigate, location.state, getDashboardPath]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters long";
    }

    const hasEmail = Boolean(formData.email && formData.email.trim());
    const hasPhone = Boolean(formData.phone && formData.phone.trim());

    if (!hasEmail && !hasPhone) {
      errors.contact = "At least one contact method (email or phone) is required";
    }

    if (hasEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errors.email = "Please enter a valid email address";
      }
    }

    if (hasPhone) {
      const phoneRegex = /^[+]?[0-9\s-]{7,20}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        errors.phone = "Please enter a valid phone number format";
      }
    }

    // Backend password constraints
    if (!formData.password || formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    } else if (!/[A-Z]/.test(formData.password)) {
      errors.password = "Password must include at least one uppercase letter";
    } else if (!/[a-z]/.test(formData.password)) {
      errors.password = "Password must include at least one lowercase letter";
    } else if (!/[0-9]/.test(formData.password)) {
      errors.password = "Password must include at least one number";
    } else if (!/[^A-Za-z0-9]/.test(formData.password)) {
      errors.password = "Password must include at least one special character";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setFieldErrors({});

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMessage(Object.values(errors)[0]);
      return;
    }

    setIsSubmitting(true);
    try {
      const registeredUser = await register({
        name: formData.name.trim(),
        email: formData.email.trim() ? formData.email.trim() : null,
        phone: formData.phone.trim() ? formData.phone.trim() : null,
        password: formData.password,
      });

      const destination = location.state?.from?.pathname || getDashboardPath(registeredUser.role);
      navigate(destination, { replace: true });
    } catch (err) {
      if (err.details && Array.isArray(err.details)) {
        const detailMsg = err.details.map((d) => d.message || d.field).join(", ");
        setErrorMessage(detailMsg || err.message);
      } else {
        setErrorMessage(err.message || "Registration failed. Please check your information.");
      }
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

      {/* Register Card */}
      <div className="w-full max-w-sm bg-white rounded-xl border border-[#E2E8F0] shadow-2xs p-6 sm:p-7">
        <h1 className="text-xl font-bold text-[#111827] text-center">
          Create an Account
        </h1>
        <p className="text-xs text-[#64748B] text-center mt-1">
          Join WaitLess to book services and track live queues
        </p>

        {errorMessage && (
          <div
            role="alert"
            className="mt-4 rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200"
          >
            {errorMessage}
          </div>
        )}

        <form className="mt-5 space-y-3.5" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-semibold text-[#111827] mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Alex Morgan"
              disabled={isSubmitting}
              className={`w-full px-3 py-2 rounded-lg border bg-white text-[#111827] text-xs focus:outline-none focus:ring-1 transition-colors disabled:opacity-60 ${
                fieldErrors.name
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-[#E2E8F0] focus:border-[#2563EB] focus:ring-[#2563EB]"
              }`}
            />
            {fieldErrors.name && (
              <p className="mt-1 text-[11px] text-red-600">{fieldErrors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-[#111827] mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              disabled={isSubmitting}
              className={`w-full px-3 py-2 rounded-lg border bg-white text-[#111827] text-xs focus:outline-none focus:ring-1 transition-colors disabled:opacity-60 ${
                fieldErrors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-[#E2E8F0] focus:border-[#2563EB] focus:ring-[#2563EB]"
              }`}
            />
            {fieldErrors.email && (
              <p className="mt-1 text-[11px] text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-xs font-semibold text-[#111827] mb-1"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              disabled={isSubmitting}
              className={`w-full px-3 py-2 rounded-lg border bg-white text-[#111827] text-xs focus:outline-none focus:ring-1 transition-colors disabled:opacity-60 ${
                fieldErrors.phone
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-[#E2E8F0] focus:border-[#2563EB] focus:ring-[#2563EB]"
              }`}
            />
            {fieldErrors.phone && (
              <p className="mt-1 text-[11px] text-red-600">{fieldErrors.phone}</p>
            )}
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
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={isSubmitting}
              className={`w-full px-3 py-2 rounded-lg border bg-white text-[#111827] text-xs focus:outline-none focus:ring-1 transition-colors disabled:opacity-60 ${
                fieldErrors.password
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-[#E2E8F0] focus:border-[#2563EB] focus:ring-[#2563EB]"
              }`}
            />
            {fieldErrors.password && (
              <p className="mt-1 text-[11px] text-red-600">{fieldErrors.password}</p>
            )}
            <p className="mt-1 text-[10px] text-[#64748B]">
              At least 8 characters with uppercase, lowercase, number & special char.
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-xs font-semibold text-[#111827] mb-1"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              name="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={isSubmitting}
              className={`w-full px-3 py-2 rounded-lg border bg-white text-[#111827] text-xs focus:outline-none focus:ring-1 transition-colors disabled:opacity-60 ${
                fieldErrors.confirmPassword
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-[#E2E8F0] focus:border-[#2563EB] focus:ring-[#2563EB]"
              }`}
            />
            {fieldErrors.confirmPassword && (
              <p className="mt-1 text-[11px] text-red-600">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          {/* Register button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-2.5 px-4 bg-[#2563EB] hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg text-xs transition-colors shadow-2xs flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Link to Login */}
        <div className="mt-5 pt-4 border-t border-[#E2E8F0] text-center text-xs text-[#64748B]">
          <span>Already have an account? </span>
          <Link
            to="/login"
            className="text-[#2563EB] hover:underline font-semibold"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
