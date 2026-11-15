import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { businessApi } from "../../../api/auth";

const CATEGORIES = [
  "Barbers & Salons",
  "Health & Clinics",
  "Auto Service & Repair",
  "Dining & Cafes",
  "Beauty & Wellness",
  "Fitness & Physical Therapy",
  "Other Local Service",
];

function Discover() {
  const [businesses, setBusinesses] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    pages: 1,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBusinesses = useCallback(async (page, category, search, location) => {
    try {
      setError(null);
      const effectiveSearch = (search || location || "").trim();

      const params = {
        page,
        limit: 9,
      };

      if (category && category !== "All" && category !== "All Categories") {
        params.category = category;
      }

      if (effectiveSearch) {
        params.search = effectiveSearch;
      }

      const res = await businessApi.getPublicBusinesses(params);
      if (res?.data) {
        setBusinesses(res.data.businesses || []);
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
      }
    } catch (err) {
      setError(err.message || "Failed to load businesses. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const effectiveSearch = (searchTerm || locationTerm || "").trim();
        const params = {
          page: currentPage,
          limit: 9,
        };

        if (selectedCategory && selectedCategory !== "All" && selectedCategory !== "All Categories") {
          params.category = selectedCategory;
        }

        if (effectiveSearch) {
          params.search = effectiveSearch;
        }

        const res = await businessApi.getPublicBusinesses(params);
        if (!ignore && res?.data) {
          setBusinesses(res.data.businesses || []);
          if (res.data.pagination) {
            setPagination(res.data.pagination);
          }
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || "Failed to load businesses. Please try again.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [currentPage, selectedCategory, searchTerm, locationTerm]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setCurrentPage(1);
    fetchBusinesses(1, selectedCategory, searchTerm, locationTerm);
  };

  const handleCategorySelect = (cat) => {
    setLoading(true);
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (pagination.pages || 1)) {
      setLoading(true);
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

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
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-2xs"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Search businesses or services */}
              <div className="md:col-span-6 flex items-center px-3.5 py-2.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search businesses by name or keyword"
                  className="w-full bg-transparent text-sm text-[#111827] placeholder-[#64748B] focus:outline-none"
                />
              </div>

              {/* Location UI */}
              <div className="md:col-span-4 flex items-center px-3.5 py-2.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
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
                  value={locationTerm}
                  onChange={(e) => setLocationTerm(e.target.value)}
                  placeholder="Search by city (e.g. Bangalore)"
                  className="w-full bg-transparent text-sm text-[#111827] placeholder-[#64748B] focus:outline-none"
                />
              </div>

              {/* Search Button */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full h-full min-h-[44px] flex items-center justify-center px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer shadow-2xs"
                >
                  Search
                </button>
              </div>
            </div>
          </form>

          {/* 4. Categories Scrollable Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => handleCategorySelect("All")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border cursor-pointer ${
                selectedCategory === "All"
                  ? "bg-[#3730A3] text-white border-[#3730A3]"
                  : "bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-50"
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategorySelect(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#3730A3] text-white border-[#3730A3]"
                    : "bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 5. Filters Dropdowns */}
          <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-2xs">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {/* Category Dropdown */}
              <div>
                <label
                  htmlFor="filter-category"
                  className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1"
                >
                  Category
                </label>
                <select
                  id="filter-category"
                  value={selectedCategory}
                  onChange={(e) => handleCategorySelect(e.target.value)}
                  className="w-full p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs text-[#111827] focus:outline-none"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Distance */}
              <div>
                <label
                  htmlFor="filter-distance"
                  className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1"
                >
                  Distance
                </label>
                <select
                  id="filter-distance"
                  defaultValue="Any distance"
                  className="w-full p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs text-[#111827] focus:outline-none"
                >
                  <option>Any distance</option>
                  <option>Within 2 miles</option>
                  <option>Within 5 miles</option>
                  <option>Within 10 miles</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="filter-status"
                  className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1"
                >
                  Venue Status
                </label>
                <select
                  id="filter-status"
                  defaultValue="All Active"
                  className="w-full p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs text-[#111827] focus:outline-none"
                >
                  <option>All Active</option>
                  <option>Open Now</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label
                  htmlFor="filter-price"
                  className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1"
                >
                  Price Range
                </label>
                <select
                  id="filter-price"
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
                <label
                  htmlFor="filter-avail"
                  className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1"
                >
                  Queue &amp; Booking
                </label>
                <select
                  id="filter-avail"
                  defaultValue="All Venues"
                  className="w-full p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs text-[#111827] focus:outline-none"
                >
                  <option>All Venues</option>
                  <option>Accepting Bookings</option>
                  <option>Live Queue Active</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Header Bar */}
          <div className="flex items-center justify-between text-xs text-[#64748B] pt-2">
            <span>
              {pagination.total > 0
                ? `Showing ${businesses.length} of ${pagination.total} businesses`
                : "Business Listings"}
            </span>
            <span>Sorted by newest</span>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center justify-between">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => fetchBusinesses(currentPage, selectedCategory, searchTerm, locationTerm)}
                className="px-3 py-1 bg-rose-600 text-white rounded text-xs font-semibold hover:bg-rose-700"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="py-16 text-center text-xs text-[#64748B] space-y-3">
              <div className="inline-block h-8 w-8 rounded-full border-2 border-[#2563EB] border-t-transparent animate-spin" />
              <p>Loading approved businesses...</p>
            </div>
          ) : businesses.length === 0 ? (
            /* Empty State */
            <div className="py-16 text-center bg-white rounded-xl border border-[#E2E8F0] p-8 space-y-3">
              <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-xl">
                🔍
              </div>
              <h3 className="text-base font-bold text-[#111827]">
                No businesses found
              </h3>
              <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                We couldn&apos;t find any approved businesses matching your search or category filter. Try clearing filters or searching another city.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setLocationTerm("");
                  setSelectedCategory("All");
                  setCurrentPage(1);
                }}
                className="inline-flex items-center justify-center px-4 py-2 bg-[#2563EB] text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            /* 6. Business Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((biz) => {
                const businessLocation = biz.address
                  ? `${biz.address.street}, ${biz.address.city}`
                  : "Location not provided";

                return (
                  <div
                    key={biz._id}
                    className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-colors"
                  >
                    <div>
                      {/* Business Image Container */}
                      <div className="h-40 bg-slate-50 border-b border-[#E2E8F0] flex items-center justify-center relative p-4">
                        <div className="h-12 w-12 rounded-xl bg-[#3730A3] text-white flex items-center justify-center font-bold text-base">
                          {biz.name.slice(0, 2).toUpperCase()}
                        </div>

                        <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-xs font-semibold bg-white text-[#3730A3] border border-[#E2E8F0]">
                          {biz.category}
                        </span>

                        <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active
                        </span>
                      </div>

                      {/* Business Content */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h2 className="text-base font-bold text-[#111827]">
                            {biz.name}
                          </h2>
                        </div>

                        {/* Rating, Review count & City */}
                        <div className="flex items-center gap-2 text-xs text-[#64748B]">
                          <span className="font-semibold text-emerald-600">
                            ★ Verified Venue
                          </span>
                          <span>•</span>
                          <span>{biz.address?.city || "Local"}</span>
                        </div>

                        {/* Location */}
                        <p className="text-xs text-[#64748B] truncate">
                          {businessLocation}
                        </p>

                        {/* Description */}
                        {biz.description && (
                          <p className="text-xs text-[#64748B] line-clamp-2 pt-1">
                            {biz.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* View Business Button */}
                    <div className="p-4 pt-2">
                      <Link
                        to={`/business/${biz._id}`}
                        className="block w-full min-h-[44px] flex items-center justify-center text-center py-2.5 px-3 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        View Business
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="pt-6 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1 || loading}
                className="px-3.5 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                &larr; Previous
              </button>

              <span>
                Page <strong className="text-[#111827]">{currentPage}</strong> of{" "}
                <strong className="text-[#111827]">{pagination.pages}</strong>
              </span>

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= pagination.pages || loading}
                className="px-3.5 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Next &rarr;
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Discover;
