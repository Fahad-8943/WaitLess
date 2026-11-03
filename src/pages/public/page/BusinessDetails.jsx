import { Link, useParams } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { sampleBusiness } from "../../../data/sampleBusiness";

function BusinessDetails() {
  const { businessId } = useParams();
  const business = sampleBusiness;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans">
      <Header />

      <main className="flex-grow pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <Link to="/discover" className="hover:text-[#2563EB] transition-colors">
              &larr; Back to Discover
            </Link>
            <span>/</span>
            <span className="text-[#111827]">{business.name}</span>
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
                <span className="text-[11px] text-[#64748B] mt-0.5">
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
                  <span className="font-semibold text-amber-600">
                    ★ {business.rating}
                  </span>
                  <span>({business.reviewCount} reviews)</span>
                  <span>&bull;</span>
                  <span>{business.location}</span>
                  <span>&bull;</span>
                  <span className="text-emerald-700 font-medium">
                    {business.openingHours}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed pt-2 border-t border-[#E2E8F0]">
                  {business.description}
                </p>
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
                    {business.services.length} services offered
                  </span>
                </div>

                <div className="divide-y divide-[#E2E8F0]">
                  {business.services.map((svc) => (
                    <div
                      key={svc.name}
                      className="py-3.5 first:pt-3 last:pb-0 flex items-start justify-between gap-4"
                    >
                      <div>
                        <h3 className="text-sm font-semibold text-[#111827]">
                          {svc.name}
                        </h3>
                        <p className="text-xs text-[#64748B] mt-0.5">
                          {svc.desc}
                        </p>
                        <span className="inline-block mt-1 text-[11px] font-medium text-[#2563EB]">
                          Duration: ~{svc.duration}
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-bold text-[#111827]">
                          {svc.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Reviews */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs p-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                  <h2 className="text-base font-bold text-[#111827]">
                    Customer Reviews
                  </h2>
                  <span className="text-xs font-semibold text-amber-600">
                    ★ {business.rating} average
                  </span>
                </div>

                <div className="divide-y divide-[#E2E8F0]">
                  {business.customerReviews.map((rev, idx) => (
                    <div key={idx} className="py-3.5 first:pt-3 last:pb-0 text-xs">
                      <div className="flex items-center justify-between">
                        <strong className="text-[#111827]">{rev.user}</strong>
                        <span className="text-[#64748B]">{rev.date}</span>
                      </div>
                      <div className="text-amber-500 mt-0.5">
                        {"★".repeat(rev.rating)}
                      </div>
                      <p className="text-[#64748B] mt-1 leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Current Queue Information & Actions */}
            <div className="lg:col-span-5 sticky top-24">
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                  <h2 className="text-base font-bold text-[#111827]">
                    Current Queue
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                    <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                      Current Token
                    </span>
                    <strong className="text-xl font-black text-[#111827] mt-0.5 block">
                      {business.currentQueue.currentToken || "?"}
                    </strong>
                  </div>

                  <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                    <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                      People Waiting
                    </span>
                    <strong className="text-xl font-black text-[#111827] mt-0.5 block">
                      {business.currentQueue.peopleWaiting} people
                    </strong>
                  </div>
                </div>

                <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-lg flex items-center justify-between text-xs">
                  <span className="font-medium text-[#2563EB]">
                    Estimated Waiting Time
                  </span>
                  <strong className="text-sm font-bold text-[#2563EB]">
                    {business.currentQueue.estimatedWaitingTime || "Not available"}
                  </strong>
                </div>

                {/* Booking & Queue Buttons */}
                <div className="space-y-2 pt-2">
                  <Link
                    to={`/login?redirect=${encodeURIComponent(`/user/queue?business=${businessId}`)}`}
                    className="block w-full py-2.5 px-4 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-center rounded-lg text-xs transition-colors shadow-2xs"
                  >
                    Join Queue
                  </Link>
                  <Link
                    to={`/login?redirect=${encodeURIComponent(`/user/bookings?business=${businessId}`)}`}
                    className="block w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#111827] font-semibold text-center rounded-lg text-xs transition-colors"
                  >
                    Book a Slot
                  </Link>
                </div>

                <p className="text-[11px] text-[#64748B] text-center pt-2">
                  A 10-minute grace period applies once your token is called.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default BusinessDetails;
