import { Link } from "react-router";

function HeroSection() {
  return (
    <section className="bg-white border-b border-[#E2E8F0] pt-28 pb-16 md:pt-32 md:pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]"></span>
              Smart Service Booking &amp; Queue Management
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111827] tracking-tight leading-tight">
              Find. Book. <span className="text-[#2563EB]">Wait Less.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#64748B] max-w-xl leading-relaxed">
              Discover local service businesses, check live wait times, book available slots, or join current queues from your phone before arriving.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/discover"
                className="px-5 py-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-xs"
              >
                Find a Service
              </Link>
              <a
                href="/#how-it-works"
                className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#111827] font-semibold text-sm transition-colors"
              >
                How It Works
              </a>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[#64748B]">
              <span className="flex items-center gap-1.5">
                <span className="font-bold text-[#111827]">✓</span> Live Queue Tokens
              </span>
              <span className="flex items-center gap-1.5">
                <span className="font-bold text-[#111827]">✓</span> Estimated Wait Times
              </span>
              <span className="flex items-center gap-1.5">
                <span className="font-bold text-[#111827]">✓</span> Advance Slot Booking
              </span>
            </div>
          </div>

          {/* Right Column: Grounded Product UI Preview */}
          <div className="lg:col-span-5">
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 shadow-xs max-w-md mx-auto">
              {/* Product Card Header */}
              <div className="flex items-start justify-between pb-4 border-b border-[#E2E8F0]">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#3730A3]">
                    Live Queue Example
                  </span>
                  <h2 className="text-base font-bold text-[#111827] mt-0.5">
                    Crown &amp; Blade Studio
                  </h2>
                  <p className="text-xs text-[#64748B]">Barbers &bull; Downtown</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Open Now
                </span>
              </div>

              {/* Tokens Preview */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-3.5 bg-white border border-[#2563EB]/30 rounded-xl">
                  <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider block">
                    Your Token
                  </span>
                  <span className="text-2xl font-black text-[#2563EB] mt-1 block">
                    #A-18
                  </span>
                  <span className="text-[11px] text-[#64748B]">In Queue</span>
                </div>

                <div className="p-3.5 bg-white border border-[#E2E8F0] rounded-xl">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                    Now Serving
                  </span>
                  <span className="text-2xl font-black text-[#111827] mt-1 block">
                    #A-14
                  </span>
                  <span className="text-[11px] text-[#64748B]">Chair 1</span>
                </div>
              </div>

              {/* Queue Status Details */}
              <div className="mt-4 p-3 bg-white border border-[#E2E8F0] rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#64748B] block">People Ahead</span>
                  <strong className="text-[#111827] text-sm font-bold">3 people</strong>
                </div>
                <div className="text-right">
                  <span className="text-[#64748B] block">Estimated Wait</span>
                  <strong className="text-[#2563EB] text-sm font-bold">~14 mins</strong>
                </div>
              </div>

              {/* Grace Period Note */}
              <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
                <span>Arrival Grace Period</span>
                <span className="font-semibold text-[#111827]">10 mins when called</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
