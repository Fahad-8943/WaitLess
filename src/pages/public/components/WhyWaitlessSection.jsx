import customerLifestyle from "../../../assets/showcase/showcase-customer-lifestyle.webp";
import businessCounter from "../../../assets/showcase/showcase-business-counter.webp";

function WhyWaitlessSection() {
  const customerCapabilities = [
    {
      title: "Digital Walk-in Tokens",
      description: "Join virtual queues directly from your phone and check example token status without waiting in a crowded lobby.",
    },
    {
      title: "Combined Service Durations",
      description: "Select multiple services in one request with automatic upfront cumulative time calculation.",
    },
    {
      title: "Configurable Arrival Grace Period",
      description: "Arrival window buffers hold your spot when your token is called, ensuring relaxed travel to the venue.",
    },
  ];

  const businessCapabilities = [
    {
      title: "Advance Slot Booking",
      description: "Coordinate scheduled calendar appointments alongside digital walk-in tokens from one station console.",
    },
    {
      title: "Direct Station Operator Controls",
      description: "Intuitive counter buttons to call next tokens, apply grace holds, and mark services completed.",
    },
    {
      title: "Station Queue Visibility",
      description: "Instant clarity on checked-in customers, active counter services, and patrons in transit.",
    },
  ];

  return (
    <section className="relative bg-[#07090E] border-b border-slate-800/80 py-20 md:py-28 overflow-hidden">
      {/* Subtle Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-radial from-blue-900/10 via-indigo-950/5 to-transparent blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-20 md:space-y-24">
        {/* Section Heading */}
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
            Two-Sided Coordination
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            Why WaitLess
          </h2>
          <p className="mt-3 text-base text-slate-300 leading-relaxed">
            A purposeful architecture connecting customers with local venues through transparent timing and coordinated digital queues.
          </p>
        </div>

        {/* Showcase Block 1: For Customers (Asymmetric Editorial Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Photographic Storytelling (5 cols) */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl shadow-black/80 group">
              <div className="aspect-[5/6] overflow-hidden bg-slate-900">
                <img
                  src={customerLifestyle}
                  alt="Patron reviewing digital queue ticket on smartphone while waiting at an outdoor cafe"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="eager"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#07090E] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-xs">
                <span className="text-blue-400 font-semibold block text-[11px] uppercase tracking-wider">
                  Patron Experience
                </span>
                <p className="text-slate-300 mt-0.5">
                  Relax at a nearby cafe or finish errands while your token approaches.
                </p>
              </div>
            </div>
          </div>

          {/* Narrative & Interface HUD (7 cols) */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 block mb-1">
                Customer Queue Interface
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Wait Where You Want, Not in a Crowded Lobby
              </h3>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                Receive upfront duration estimates, monitor your place in line from your smartphone, and travel to the venue knowing your station is reserved upon arrival.
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {customerCapabilities.map((item) => (
                <div key={item.title} className="p-3.5 rounded-xl bg-[#0B0F19] border border-slate-800">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="h-4 w-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">
                      ✓
                    </span>
                    <h4 className="text-xs font-semibold text-slate-100">{item.title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed pl-6">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Contextual Interface Card: Customer Queue Ticket */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 block">
                  Example Token Status · Mobile Ticket
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <strong className="text-lg font-mono font-bold text-white">#A-18</strong>
                  <span className="text-xs text-slate-300">Crown &amp; Blade Studio · Haircut &amp; Beard</span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Estimated wait ~14 mins · 3 people ahead in line
                </span>
              </div>
              <span className="shrink-0 px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-400 text-xs font-mono border border-emerald-800/60 self-start sm:self-auto">
                10m Grace Buffer Active
              </span>
            </div>
          </div>
        </div>

        {/* Showcase Block 2: For Venue Operators (Asymmetric Editorial Layout - Reversed) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-8 border-t border-slate-800/60">
          {/* Narrative & Interface HUD (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400 block mb-1">
                Operator Queue Interface
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Calm Counter Coordination for Service Desks
              </h3>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                Equip receptionists, stylists, and clinic practitioners with intuitive queue management controls to announce tokens, manage arrival buffers, and balance walk-ins with bookings.
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {businessCapabilities.map((item) => (
                <div key={item.title} className="p-3.5 rounded-xl bg-[#0B0F19] border border-slate-800">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="h-4 w-4 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">
                      ✓
                    </span>
                    <h4 className="text-xs font-semibold text-slate-100">{item.title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed pl-6">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Contextual Interface Card: Operator Desk */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 block">
                  Operator Queue Management Desk
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <strong className="text-lg font-mono font-bold text-white">Station 1: Marcus Vance (#A-104)</strong>
                </div>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  In Service · Haircut &amp; Beard Trim (45m duration)
                </span>
              </div>
              <div className="flex gap-2 shrink-0 self-start sm:self-auto">
                <span className="px-2.5 py-1 rounded bg-blue-600 text-white text-xs font-medium">
                  Call Next (#A-105)
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                  Hold Grace
                </span>
              </div>
            </div>
          </div>

          {/* Photographic Storytelling (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl shadow-black/80 group">
              <div className="aspect-[4/3] overflow-hidden bg-slate-900">
                <img
                  src={businessCounter}
                  alt="Reception desk operator utilizing a digital counter tablet at a modern service venue"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="eager"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#07090E] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-xs">
                <span className="text-indigo-400 font-semibold block text-[11px] uppercase tracking-wider">
                  Venue Counter Efficiency
                </span>
                <p className="text-slate-300 mt-0.5">
                  Clear station schedules and arrival grace management prevent lobby congestion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyWaitlessSection;
