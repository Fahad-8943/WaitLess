import { Link } from "react-router";
import heroBackdrop from "../../../assets/hero/hero-venue-backdrop.webp";
import desktopQueueMockup from "../../../assets/hero/mockup-desktop-queue.webp";
import mobileTicketMockup from "../../../assets/hero/mockup-mobile-ticket.webp";

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#07090E] border-b border-slate-800/80 pt-28 pb-16 md:pt-36 md:pb-24">
      {/* Atmospheric Service Venue Photographic Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-20 mix-blend-luminosity overflow-hidden"
      >
        <img
          src={heroBackdrop}
          alt=""
          className="h-full w-full object-cover object-center filter saturate-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07090E] via-[#07090E]/95 to-[#07090E]/75" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#07090E] via-transparent to-[#07090E]" />
      </div>

      {/* Controlled Atmospheric Lighting Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-radial from-blue-600/15 via-indigo-600/8 to-transparent blur-3xl z-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-1/4 h-[420px] w-[420px] rounded-full bg-radial from-indigo-700/10 via-cyan-600/5 to-transparent blur-3xl z-0"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Value Proposition & Verified Capabilities */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
              Service Booking &amp; Queue Management Platform
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] font-display">
              Find. Book.{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                Wait Less.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Discover local service venues, schedule advance appointments, or join a digital walk-in queue from your phone before arriving.
            </p>

            {/* Action Triggers */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
              <Link
                to="/discover"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-blue-900/30 border border-blue-400/20 active:scale-[0.98]"
              >
                Find a Service
              </Link>
              <a
                href="/#how-it-works"
                className="px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 text-slate-200 font-semibold text-sm transition-all duration-200 active:scale-[0.98]"
              >
                How It Works
              </a>
            </div>

            {/* Capability Strip */}
            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-2 gap-3 text-xs text-slate-300 text-left">
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold">
                  ✓
                </span>
                <span className="font-medium text-slate-200">Digital Walk-in Tokens</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold">
                  ✓
                </span>
                <span className="font-medium text-slate-200">Advance Slot Booking</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold">
                  ✓
                </span>
                <span className="font-medium text-slate-200">Combined Service Durations</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold">
                  ✓
                </span>
                <span className="font-medium text-slate-200">Configurable Arrival Grace Period</span>
              </div>
            </div>
          </div>

          {/* Right Column: Layered Hardware Composition (Desktop Console + Smartphone Ticket) */}
          <div className="lg:col-span-6 relative mt-6 lg:mt-0">
            {/* Layer 1: Operator Queue Interface (Desktop / Tablet Hardware Frame) */}
            <div className="rounded-2xl border border-slate-700/80 bg-[#0B0F19] shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden ring-1 ring-white/10">
              {/* Hardware Frame Chrome Bar */}
              <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80 inline-block"></span>
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80 inline-block"></span>
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-300 ml-2 hidden sm:inline">
                    Operator Queue Management Desk
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                    Crown &amp; Blade Studio · Station 1
                  </span>
                </div>
              </div>

              {/* Genuine Application Screenshot: Operator Console */}
              <div className="relative bg-slate-950 overflow-hidden aspect-[16/10]">
                <img
                  src={desktopQueueMockup}
                  alt="Operator queue management desk showing active station and example queue status"
                  className="w-full h-full object-cover object-top"
                  loading="eager"
                />
              </div>
            </div>

            {/* Layer 2: Customer Queue Interface (Floating Smartphone Hardware Frame) */}
            <div className="mt-4 lg:mt-0 lg:absolute lg:-bottom-8 lg:-right-4 xl:-right-6 w-full sm:w-72 lg:w-64 xl:w-72 rounded-[2rem] border-2 border-slate-700/90 bg-[#0A0E17] p-2.5 shadow-[0_25px_60px_rgba(0,0,0,0.95)] ring-1 ring-white/15 z-20">
              {/* Smartphone Top Notch / Speaker Grill */}
              <div className="mx-auto h-3.5 w-24 rounded-full bg-slate-900 border border-slate-800 mb-2 flex items-center justify-center" aria-hidden="true">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-700"></span>
              </div>

              {/* Smartphone Frame Inner Screen: Customer Mobile Ticket */}
              <div className="rounded-[1.3rem] overflow-hidden border border-slate-800/80 bg-slate-950 aspect-[9/16]">
                <img
                  src={mobileTicketMockup}
                  alt="Customer mobile queue ticket interface showing token number and arrival grace status"
                  className="w-full h-full object-cover object-top"
                  loading="eager"
                />
              </div>

              {/* Caption Label */}
              <div className="mt-2 text-center">
                <span className="text-[10px] font-medium text-slate-400">
                  Example token status · Customer view
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
