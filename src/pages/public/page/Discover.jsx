import { Link } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { sampleBusiness } from "../../../data/sampleBusiness";

function Discover() {
  const categories = [
    "Salons",
    "Barbers",
    "Clinics",
    "Restaurants",
    "Repair",
    "Beauty",
    "Fitness",
    "Other Services",
  ];

  const businesses = [sampleBusiness];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans">
      <Header />

      <main className="flex-grow pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          {/* 1. Page Heading */}
          <div className="pt-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
              Find a service near you
            </h1>
            <p className="mt-1 text-sm text-[#64748B]">
              Discover local businesses, view available services, and check current waiting times.
            </p>
          </div>

          {/* 2 & 3. Search UI and Location UI */}
          <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-2xs">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Search businesses or services */}
              <div className="md:col-span-7 flex items-center px-3.5 py-2.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                <svg
                  className="w-4 h-4 text-[#64748B] mr-2.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 1114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search businesses or services"
                  className="w-full bg-transparent text-sm text-[#111827] placeholder-[#64748B] focus:outline-none"
                />
              </div>

              {/* Location UI */}
              <div className="md:col-span-5 flex items-center px-3.5 py-2.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                <svg
                  className="w-4 h-4 text-[#64748B] mr-2.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Your location"
                  defaultValue="Downtown Metro"
                  className="w-full bg-transparent text-sm text-[#111827] placeholder-[#64748B] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 4. Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border bg-[#3730A3] text-white border-[#3730A3]"
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-50"
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 5. Filters */}
          <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-2xs">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {/* Category */}
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">
                  Category
                </label>
                <select
                  defaultValue="All"
                  className="w-full p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs text-[#111827] focus:outline-none"
                >
                  <option value="All">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Distance */}
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">
                  Distance
                </label>
                <select
                  defaultValue="Within 5 miles"
                  className="w-full p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs text-[#111827] focus:outline-none"
                >
                  <option>Within 2 miles</option>
                  <option>Within 5 miles</option>
                  <option>Within 10 miles</option>
                  <option>Any distance</option>
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">
                  Rating
                </label>
                <select
                  defaultValue="Any rating"
                  className="w-full p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs text-[#111827] focus:outline-none"
                >
                  <option>Any rating</option>
                  <option>4.5 &amp; up</option>
                  <option>4.0 &amp; up</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">
                  Price Range
                </label>
                <select
                  defaultValue="All prices"
                  className="w-full p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs text-[#111827] focus:outline-none"
                >
                  <option>All prices</option>
                  <option>₹ (Budget)</option>
                  <option>₹₹ (Moderate)</option>
                  <option>₹₹₹ (Premium)</option>
                </select>
              </div>

              {/* Availability */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">
                  Availability
                </label>
                <select
                  defaultValue="Open Now"
                  className="w-full p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs text-[#111827] focus:outline-none"
                >
                  <option>Open Now</option>
                  <option>Accepting Bookings</option>
                  <option>Live Queue Active</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Header Bar */}
          <div className="flex items-center justify-between text-xs text-[#64748B] pt-2">
            <span>Business Listings</span>
            <span>Sorted by nearest</span>
          </div>

          {/* 6. Business Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((biz) => (
              <div
                key={biz.id}
                className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Business Image Container */}
                  <div className="h-40 bg-slate-50 border-b border-[#E2E8F0] flex items-center justify-center relative p-4">
                    <div className="h-12 w-12 rounded-xl bg-[#3730A3] text-white flex items-center justify-center font-bold text-base">
                      {biz.name.slice(0, 2).toUpperCase()}
                    </div>

                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[11px] font-semibold bg-white text-[#3730A3] border border-[#E2E8F0]">
                      {biz.category}
                    </span>

                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {biz.status}
                    </span>
                  </div>

                  {/* Business Content */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="text-base font-bold text-[#111827]">
                        {biz.name}
                      </h2>
                    </div>

                    {/* Rating, Review count & Distance */}
                    <div className="flex items-center gap-2 text-xs text-[#64748B]">
                      <span className="font-semibold text-amber-600">
                        ★ {biz.rating}
                      </span>
                      <span>({biz.reviewCount} reviews)</span>
                      <span>&bull;</span>
                      <span>{biz.distance || "Distance unavailable"}</span>
                    </div>

                    {/* Location */}
                    <p className="text-xs text-[#64748B] truncate">
                      {biz.location}
                    </p>

                    {/* Services Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {biz.services.map((svc) => (
                        <span
                          key={svc}
                          className="px-2 py-0.5 rounded text-[11px] bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B]"
                        >
                          {svc}
                        </span>
                      ))}
                    </div>

                    {/* Starting price & Waiting time */}
                    <div className="mt-3 pt-3 border-t border-[#E2E8F0] grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[#64748B] block">Starting price</span>
                        <strong className="text-[#111827] text-sm block">
                          {biz.startingPrice || "Price not set"}
                        </strong>
                      </div>
                      <div className="text-right">
                        <span className="text-[#64748B] block">Current wait</span>
                        <strong className="text-[#2563EB] text-sm block">
                          {biz.waitingTime ? `~${biz.waitingTime}` : "Not available"}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* View Business Button */}
                <div className="p-4 pt-0">
                  <Link
                    to={`/business/${biz.id}`}
                    className="block w-full text-center py-2 px-3 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    View Business
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Discover;
