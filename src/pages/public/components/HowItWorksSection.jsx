function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="relative bg-[#07090E] border-b border-slate-800/80 py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
            Workflow Architecture
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            How WaitLess Works
          </h2>
          <p className="mt-3 text-base text-slate-300 leading-relaxed">
            Three practical steps designed to bring clear timing, flexible scheduling, and calm coordination to everyday appointments.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* Step 1: Cumulative Service Duration */}
          <div className="group relative rounded-2xl border border-slate-800 bg-[#0B0F19] p-6 sm:p-7 flex flex-col justify-between hover:border-slate-700 transition-all duration-300 shadow-xl shadow-black/40 ring-1 ring-white/5">
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="text-2xl font-black font-mono text-blue-400 group-hover:text-blue-300 transition-colors">
                  01
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-900 text-blue-400 border border-blue-500/20">
                  Duration Logic
                </span>
              </div>

              <h3 className="text-lg font-bold text-white tracking-tight">
                Select Services &amp; Review Timing
              </h3>

              <p className="mt-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Choose one or multiple services. WaitLess aggregates individual durations upfront to calculate total station time before you confirm.
              </p>
            </div>

            {/* Visual Interface Demonstration: Cumulative Duration */}
            <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-2.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                Demonstration Calculation
              </span>

              {/* Service Selection Mockup */}
              <div className="space-y-1.5">
                <div className="p-2 rounded-lg bg-slate-900/90 border border-blue-500/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 rounded bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                    <span className="font-medium text-slate-200">Haircut</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">30 min · ₹300</span>
                </div>

                <div className="p-2 rounded-lg bg-slate-900/90 border border-blue-500/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 rounded bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                    <span className="font-medium text-slate-200">Beard Trim</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">15 min · ₹150</span>
                </div>
              </div>

              {/* Aggregation Total Bar */}
              <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-500/40 flex items-center justify-between text-xs font-mono">
                <span className="text-blue-300 font-semibold">Total Duration:</span>
                <span className="text-white font-bold">30m + 15m = 45m</span>
              </div>
            </div>
          </div>

          {/* Step 2: Dual-Mode Scheduling */}
          <div className="group relative rounded-2xl border border-slate-800 bg-[#0B0F19] p-6 sm:p-7 flex flex-col justify-between hover:border-slate-700 transition-all duration-300 shadow-xl shadow-black/40 ring-1 ring-white/5">
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="text-2xl font-black font-mono text-indigo-400 group-hover:text-indigo-300 transition-colors">
                  02
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-900 text-indigo-400 border border-indigo-500/20">
                  Dual-Mode
                </span>
              </div>

              <h3 className="text-lg font-bold text-white tracking-tight">
                Advance Slot or Walk-in Token
              </h3>

              <p className="mt-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Choose the flow that suits your schedule: reserve a scheduled calendar appointment or request an example walk-in token before traveling.
              </p>
            </div>

            {/* Visual Interface Demonstration: Dual Modes */}
            <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-2.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                Scheduling Flexibility
              </span>

              {/* Mode Options */}
              <div className="grid grid-cols-2 gap-1.5 text-center text-xs">
                <div className="p-2 rounded-lg bg-indigo-950/40 border border-indigo-500/40 text-indigo-200 font-medium">
                  <span className="block text-[10px] uppercase font-bold text-indigo-400">Mode A</span>
                  Advance Booking
                </div>
                <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 font-medium">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Mode B</span>
                  Walk-in Token
                </div>
              </div>

              {/* Illustrative Slot Sample */}
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 mb-1">
                  <span>Sample Slots:</span>
                  <span className="text-emerald-400">2:30 PM · 3:15 PM</span>
                </div>
                <span className="text-[9px] text-slate-500 block leading-tight">
                  Sample demonstration slots — bookable availability varies by business
                </span>
              </div>
            </div>
          </div>

          {/* Step 3: Operator Grace Period Protocol */}
          <div className="group relative rounded-2xl border border-slate-800 bg-[#0B0F19] p-6 sm:p-7 flex flex-col justify-between hover:border-slate-700 transition-all duration-300 shadow-xl shadow-black/40 ring-1 ring-white/5">
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="text-2xl font-black font-mono text-emerald-400 group-hover:text-emerald-300 transition-colors">
                  03
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-900 text-emerald-400 border border-emerald-500/20">
                  Arrival Window
                </span>
              </div>

              <h3 className="text-lg font-bold text-white tracking-tight">
                Operator Grace Period Protocol
              </h3>

              <p className="mt-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                When your token is called by the station operator, a configured 10-minute arrival window holds your station so you can report to the desk without stress.
              </p>
            </div>

            {/* Visual Interface Demonstration: 4-Phase Timeline */}
            <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-2.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                Operator-Controlled Workflow
              </span>

              {/* 4-Phase Grid */}
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800 text-[10px]">
                  <span className="text-slate-400 font-mono block">Phase 1</span>
                  <span className="font-semibold text-slate-300">Token Called</span>
                </div>
                <div className="p-1.5 rounded bg-amber-950/40 border border-amber-600/40 text-[10px]">
                  <span className="text-amber-400 font-mono font-bold block">Phase 2 · Active</span>
                  <span className="font-semibold text-amber-200">10m Grace Buffer</span>
                </div>
                <div className="p-1.5 rounded bg-slate-900/50 border border-slate-800 text-[10px] text-slate-400">
                  <span className="font-mono block">Phase 3</span>
                  <span>Counter Check-in</span>
                </div>
                <div className="p-1.5 rounded bg-slate-900/50 border border-slate-800 text-[10px] text-slate-400">
                  <span className="font-mono block">Phase 4</span>
                  <span>In Service</span>
                </div>
              </div>

              <div className="p-1.5 text-center bg-slate-900/60 rounded border border-slate-800/80">
                <span className="text-[10px] text-slate-400">
                  Station held by operator during 10m buffer
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
