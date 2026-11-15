import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { businessApi } from "../../../api/auth";
import { useAuth } from "../../../context/useAuth";

function BusinessDetails() {
  const { businessId } = useParams();
  const { isAuthenticated } = useAuth();

  const [business, setBusiness] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!businessId) return;
      try {
        setLoading(true);
        setError(null);

        const [profileRes, servicesRes] = await Promise.all([
          businessApi.getPublicProfile(businessId),
          businessApi.getPublicServices(businessId),
        ]);

        if (isMounted) {
          setBusiness(profileRes?.data?.business || null);
          setServices(servicesRes?.data?.services || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.message ||
              "Failed to load venue details. Business may not exist or is inactive."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [businessId]);

  const queueUrl = isAuthenticated
    ? `/user/queue?business=${businessId}`
    : `/login?redirect=${encodeURIComponent(`/user/queue?business=${businessId}`)}`;

  const bookingUrl = isAuthenticated
    ? `/user/bookings?business=${businessId}`
    : `/login?redirect=${encodeURIComponent(`/user/bookings?business=${businessId}`)}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans">
        <Header />
        <main className="flex-grow pt-24 pb-16 flex items-center justify-center">
          <div className="text-center text-xs text-[#64748B] space-y-3">
            <div className="inline-block h-8 w-8 rounded-full border-2 border-[#2563EB] border-t-transparent animate-spin" />
            <p>Loading business details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans">
        <Header />
        <main className="flex-grow pt-24 pb-16">
          <div className="mx-auto max-w-3xl px-4 text-center py-16 bg-white rounded-xl border border-[#E2E8F0] p-8 space-y-4">
            <div className="h-12 w-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center text-xl font-bold">
              !
            </div>
            <h1 className="text-lg font-bold text-[#111827]">
              Business Not Found
            </h1>
            <p className="text-xs text-[#64748B]">
              {error ||
                "The requested business profile is not available or has not been approved yet."}
            </p>
            <div className="pt-2">
              <Link
                to="/discover"
                className="inline-flex items-center justify-center px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                &larr; Back to Discover
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const businessLocation = business.address
    ? `${business.address.street}, ${business.address.city}, ${business.address.state} ${business.address.postalCode}`
    : "Address unavailable";

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans">
      <Header />

      <main className="flex-grow pt-24 pb-28 lg:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <Link to="/discover" className="hover:text-[#2563EB] transition-colors">
              &larr; Back to Discover
            </Link>
            <span>/</span>
            <span className="text-[#111827] font-medium">{business.name}</span>
          </div>

          {/* Business Image & Header Block */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
              {/* Photo representation */}
              <div className="md:col-span-4 bg-slate-100 p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-[#E2E8F0]">
                <div className="h-16 w-16 rounded-xl bg-[#3730A3] text-white flex items-center justify-center font-bold text-xl shadow-xs">
                  {business.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-xs font-semibold text-[#111827] mt-3 block">
                  {business.name}
                </span>
                <span className="text-xs text-[#64748B] mt-0.5">
                  {business.category}
                </span>
              </div>

              {/* Business Overview */}
              <div className="md:col-span-8 p-6 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h1 className="text-2xl font-extrabold text-[#111827]">
                    {business.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                    {business.category}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B]">
                  <span className="font-semibold text-emerald-600">
                    ★ Verified Venue
                  </span>
                  <span>•</span>
                  <span>{business.address?.city || "Local"}</span>
                  {business.contact?.phone && (
                    <>
                      <span>•</span>
                      <span>{business.contact.phone}</span>
                    </>
                  )}
                </div>

                <p className="text-xs text-[#64748B] leading-relaxed pt-1">
                  {businessLocation}
                </p>

                {business.description && (
                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed pt-2 border-t border-[#E2E8F0]">
                    {business.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Main Layout: Services (Left) & Live Queue Actions (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Services List */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs p-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                  <h2 className="text-base font-bold text-[#111827]">
                    Available Services
                  </h2>
                  <span className="text-xs text-[#64748B]">
                    {services.length} services offered
                  </span>
                </div>

                {services.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#64748B]">
                    No active services listed for this venue at this moment.
                  </div>
                ) : (
                  <div className="divide-y divide-[#E2E8F0]">
                    {services.map((svc) => (
                      <div
                        key={svc._id}
                        className="py-3.5 first:pt-3 last:pb-0 flex items-start justify-between gap-4"
                      >
                        <div>
                          <h3 className="text-sm font-semibold text-[#111827]">
                            {svc.name}
                          </h3>
                          {svc.description && (
                            <p className="text-xs text-[#64748B] mt-0.5">
                              {svc.description}
                            </p>
                          )}
                          <span className="inline-block mt-1 text-xs font-medium text-[#2563EB]">
                            Duration: ~{svc.duration} mins
                          </span>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-sm font-bold text-[#111827]">
                            ₹{svc.price}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Venue Notice */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs p-5">
                <div className="pb-2 border-b border-[#E2E8F0]">
                  <h2 className="text-base font-bold text-[#111827]">
                    Venue Experience &amp; Policies
                  </h2>
                </div>
                <div className="pt-3 text-xs text-[#64748B] space-y-2">
                  <p>
                    • Appointments and walk-in tokens are managed in real-time.
                  </p>
                  <p>
                    • A 10-minute grace period applies once your token is called before forfeiture.
                  </p>
                  <p>
                    • Cancel upcoming bookings at least 1 hour in advance if your schedule changes.
                  </p>
                </div>
              </div>
            </div>

            {/* Current Queue Information & Actions */}
            <div className="lg:col-span-5 sticky top-24">
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                  <h2 className="text-base font-bold text-[#111827]">
                    Queue &amp; Appointments
                  </h2>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Live Active
                  </span>
                </div>

                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                  <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
                    Venue Status
                  </span>
                  <strong className="text-base font-bold text-[#111827] mt-0.5 block">
                    Accepting Walk-ins &amp; Bookings
                  </strong>
                  <span className="text-[11px] text-[#64748B] mt-0.5 block">
                    Join online to avoid waiting on-site.
                  </span>
                </div>

                {/* Booking & Queue Buttons */}
                <div className="space-y-2 pt-2">
                  <Link
                    to={queueUrl}
                    className="hidden lg:flex items-center justify-center w-full min-h-[44px] py-2.5 px-4 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-center rounded-lg text-xs transition-colors shadow-2xs"
                  >
                    Join Walk-in Queue
                  </Link>
                  <Link
                    to={bookingUrl}
                    className="flex items-center justify-center w-full min-h-[44px] py-2.5 px-4 bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#111827] font-semibold text-center rounded-lg text-xs transition-colors"
                  >
                    Book an Appointment Slot
                  </Link>
                </div>

                <p className="text-xs text-[#64748B] text-center pt-2">
                  Live token positions are tracked directly in your customer queue.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-Only Sticky Bottom Booking Bar */}
        <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-lg z-20">
          <div className="mx-auto flex items-center justify-between gap-3 max-w-md">
            <div className="min-w-0">
              <span className="text-xs text-[#64748B] block truncate">{business.name}</span>
              <strong className="text-sm font-bold text-[#2563EB] block truncate">
                Queue Active
              </strong>
            </div>
            <Link
              to={queueUrl}
              className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-2xs whitespace-nowrap"
            >
              Join Queue
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default BusinessDetails;
