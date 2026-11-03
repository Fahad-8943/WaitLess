import logo from "../../../../src/assets/logo.png";
import { Link } from "react-router";

function BusinessRegister() {
  const categories = [
    "Barbers & Salons",
    "Health & Clinics",
    "Auto Service & Repair",
    "Dining & Cafes",
    "Beauty & Wellness",
    "Fitness & Physical Therapy",
    "Other Local Service",
  ];

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

        <form className="mt-5 space-y-3.5" onSubmit={(e) => e.preventDefault()}>
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
              name="business-name"
              placeholder="e.g. Crown & Blade Studio"
              className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors"
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
              name="business-category"
              defaultValue="Barbers & Salons"
              className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors"
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
              name="owner-name"
              placeholder="e.g. Elena Vance"
              className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors"
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
                placeholder="contact@business.com"
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors"
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
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block text-xs font-semibold text-[#111827] mb-1"
            >
              Physical Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Suite, Street Address, City, State"
              className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors"
            />
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
              placeholder="Brief description of your business and services..."
              className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors resize-none"
            ></textarea>
          </div>

          {/* Register Business button */}
          <button
            type="button"
            className="w-full mt-2 py-2.5 px-4 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition-colors shadow-2xs"
          >
            Register Business
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
