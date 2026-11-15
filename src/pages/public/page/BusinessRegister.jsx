import { useState, useEffect } from "react";
import logo from "../../../../src/assets/logo.png";
import { Link, useNavigate, useLocation } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import { businessApi } from "../../../api/auth";

function BusinessRegister() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isLoading, elevateToProvider } = useAuth();

  const categories = [
    "Barbers & Salons",
    "Health & Clinics",
    "Auto Service & Repair",
    "Dining & Cafes",
    "Beauty & Wellness",
    "Fitness & Physical Therapy",
    "Other Local Service",
  ];

  const defaultOperatingHours = [
    { dayOfWeek: 0, openTime: "09:00", closeTime: "18:00", isClosed: true },
    { dayOfWeek: 1, openTime: "09:00", closeTime: "20:00", isClosed: false },
    { dayOfWeek: 2, openTime: "09:00", closeTime: "20:00", isClosed: false },
    { dayOfWeek: 3, openTime: "09:00", closeTime: "20:00", isClosed: false },
    { dayOfWeek: 4, openTime: "09:00", closeTime: "20:00", isClosed: false },
    { dayOfWeek: 5, openTime: "09:00", closeTime: "21:00", isClosed: false },
    { dayOfWeek: 6, openTime: "09:00", closeTime: "21:00", isClosed: false },
  ];

  const [formData, setFormData] = useState({
    name: "",
    category: "Barbers & Salons",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    latitude: "",
    longitude: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successNotice, setSuccessNotice] = useState("");
  const [detectingLocation, setDetectingLocation] = useState(false);

  const displayedOwnerName = formData.ownerName !== "" ? formData.ownerName : (user?.name || "");
  const displayedEmail = formData.email !== "" ? formData.email : (user?.email || "");
  const displayedPhone = formData.phone !== "" ? formData.phone : (user?.phone || "");

  // Require authenticated customer to access business registration
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login", {
        replace: true,
        state: { from: location },
      });
    }
  }, [isLoading, isAuthenticated, navigate, location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage("Geolocation is not supported by your browser. Please enter coordinates manually.");
      return;
    }

    setDetectingLocation(true);
    setErrorMessage("");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDetectingLocation(false);
        setFormData((prev) => ({
          ...prev,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
      },
      (err) => {
        setDetectingLocation(false);
        setErrorMessage(
          err.message || "Unable to retrieve GPS coordinates. Please enter latitude and longitude manually."
        );
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessNotice("");

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setErrorMessage("Business name must be at least 2 characters long");
      return;
    }

    // Resolve structured address
    let street = (formData.address || "").trim();
    let city = (formData.city || "").trim();
    let state = (formData.state || "").trim();
    let postalCode = (formData.postalCode || "").trim();

    // Fallback: If address was input as a single composite string, parse parts
    if (street && (!city || !state || !postalCode)) {
      const parts = street.split(",").map((s) => s.trim()).filter(Boolean);
      if (parts.length >= 4) {
        street = parts.slice(0, parts.length - 3).join(", ");
        if (!city) city = parts[parts.length - 3];
        if (!state) state = parts[parts.length - 2];
        if (!postalCode) postalCode = parts[parts.length - 1];
      } else if (parts.length === 3) {
        street = parts[0];
        if (!city) city = parts[1];
        if (!state) state = parts[2];
      }
    }

    if (!street) {
      setErrorMessage("Street address is required");
      return;
    }
    if (!city) {
      setErrorMessage("City is required");
      return;
    }
    if (!state) {
      setErrorMessage("State is required");
      return;
    }
    if (!postalCode) {
      setErrorMessage("Postal code is required");
      return;
    }

    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);

    if (
      isNaN(lat) ||
      lat < -90 ||
      lat > 90 ||
      isNaN(lng) ||
      lng < -180 ||
      lng > 180
    ) {
      setErrorMessage(
        "Valid geographical coordinates are required. Latitude must be between -90 and 90, Longitude between -180 and 180."
      );
      return;
    }

    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      description: formData.description.trim() || "",
      contact: {
        email: formData.email.trim() || user?.email || null,
        phone: formData.phone.trim() || user?.phone || null,
      },
      address: {
        street,
        city,
        state,
        postalCode,
        country: "IN",
      },
      location: {
        type: "Point",
        coordinates: [lng, lat], // GeoJSON order: [longitude, latitude]
      },
      timezone: "Asia/Kolkata",
      operatingHours: defaultOperatingHours,
      policies: {
        maxQueueCapacity: 50,
        remoteQueueEnabled: true,
        gracePeriodMinutes: 10,
      },
    };

    setIsSubmitting(true);
    try {
      const response = await businessApi.register(payload);
      const { business, accessToken } = response.data;

      // Role elevation: update auth context with refreshed provider token
      if (accessToken) {
        elevateToProvider(accessToken, { role: "provider" });
      }

      // Handle approval status feedback
      const isPending = business?.approvalStatus === "pending";
      const noticeText = isPending
        ? "Business venue registered successfully and is currently pending platform administrator approval."
        : "Business venue registered successfully!";

      setSuccessNotice(noticeText);

      // Redirect provider to provider dashboard
      setTimeout(() => {
        navigate("/business/dashboard", {
          replace: true,
          state: {
            business,
            approvalStatus: business?.approvalStatus,
            notice: noticeText,
          },
        });
      }, 900);
    } catch (err) {
      if (err.details && Array.isArray(err.details)) {
        const detailMsg = err.details.map((d) => d.message || d.field).join(", ");
        setErrorMessage(detailMsg || err.message);
      } else {
        setErrorMessage(err.message || "Failed to register business venue");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#2563EB] border-t-transparent" />
          <p className="text-xs font-semibold text-[#64748B]">Loading your customer profile...</p>
        </div>
      </div>
    );
  }

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

      {/* Business Register Card */}
      <div className="w-full max-w-lg bg-white rounded-xl border border-[#E2E8F0] shadow-2xs p-6 sm:p-8">
        <h1 className="text-xl font-bold text-[#111827] text-center">
          Register Your Business
        </h1>
        <p className="text-xs text-[#64748B] text-center mt-1">
          List your venue on WaitLess to manage bookings and live queues
        </p>

        {errorMessage && (
          <div
            role="alert"
            className="mt-4 rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200"
          >
            {errorMessage}
          </div>
        )}

        {successNotice && (
          <div
            role="status"
            className="mt-4 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800 border border-emerald-200"
          >
            {successNotice}
          </div>
        )}

        <form className="mt-5 space-y-3.5" onSubmit={handleSubmit}>
          {/* Business Name */}
          <div>
            <label
              htmlFor="business-name"
              className="block text-xs font-semibold text-[#111827] mb-1"
            >
              Business Name
            </label>
            <input
              type="text"
              id="business-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Crown & Blade Studio"
              disabled={isSubmitting}
              className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors disabled:opacity-60"
            />
          </div>

          {/* Business Category */}
          <div>
            <label
              htmlFor="business-category"
              className="block text-xs font-semibold text-[#111827] mb-1"
            >
              Business Category
            </label>
            <select
              id="business-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors disabled:opacity-60"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Owner Name */}
          <div>
            <label
              htmlFor="owner-name"
              className="block text-xs font-semibold text-[#111827] mb-1"
            >
              Owner Name
            </label>
            <input
              type="text"
              id="owner-name"
              name="ownerName"
              value={displayedOwnerName}
              onChange={handleChange}
              placeholder="e.g. Elena Vance"
              disabled={isSubmitting}
              className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors disabled:opacity-60"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-[#111827] mb-1"
              >
                Business Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={displayedEmail}
                onChange={handleChange}
                placeholder="contact@business.com"
                disabled={isSubmitting}
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors disabled:opacity-60"
              />
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
                value={displayedPhone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                disabled={isSubmitting}
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors disabled:opacity-60"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block text-xs font-semibold text-[#111827] mb-1"
            >
              Street Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Suite, Street Address (e.g. 428 Market St)"
              disabled={isSubmitting}
              className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors disabled:opacity-60"
            />
          </div>

          {/* City, State, Postal Code */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label
                htmlFor="city"
                className="block text-xs font-semibold text-[#111827] mb-1"
              >
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Mumbai"
                disabled={isSubmitting}
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="state"
                className="block text-xs font-semibold text-[#111827] mb-1"
              >
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="e.g. Maharashtra"
                disabled={isSubmitting}
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="postalCode"
                className="block text-xs font-semibold text-[#111827] mb-1"
              >
                Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="e.g. 400001"
                disabled={isSubmitting}
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors disabled:opacity-60"
              />
            </div>
          </div>

          {/* Business Coordinates & Geolocation */}
          <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#111827]">
                Location Coordinates
              </span>
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={detectingLocation || isSubmitting}
                className="text-[11px] font-semibold text-[#2563EB] hover:text-blue-800 flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {detectingLocation ? (
                  <>
                    <span className="h-2.5 w-2.5 rounded-full border border-[#2563EB] border-t-transparent animate-spin" />
                    <span>Detecting...</span>
                  </>
                ) : (
                  <>
                    <span>📍</span>
                    <span>Detect GPS Location</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="latitude"
                  className="block text-[11px] font-semibold text-[#64748B] mb-1"
                >
                  Latitude (-90 to 90)
                </label>
                <input
                  type="number"
                  step="any"
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="e.g. 19.0760"
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="longitude"
                  className="block text-[11px] font-semibold text-[#64748B] mb-1"
                >
                  Longitude (-180 to 180)
                </label>
                <input
                  type="number"
                  step="any"
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="e.g. 72.8777"
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors disabled:opacity-60"
                />
              </div>
            </div>
          </div>

          {/* Business Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-xs font-semibold text-[#111827] mb-1"
            >
              Business Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of your business and services..."
              disabled={isSubmitting}
              className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors resize-none disabled:opacity-60"
            ></textarea>
          </div>

          {/* Register Business button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-2.5 px-4 bg-[#2563EB] hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg text-xs transition-colors shadow-2xs flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Registering Business...</span>
              </>
            ) : (
              "Register Business"
            )}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-[#E2E8F0] text-center text-xs text-[#64748B]">
          <span>Already registered your business? </span>
          <Link
            to="/business/dashboard"
            className="text-[#2563EB] hover:underline font-semibold"
          >
            Go to Business Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BusinessRegister;
