import BusinessNav from "../components/BusinessNav";

function Queue() {
  const queueHeader = {
    businessName: "Crown & Blade Studio",
    date: "Saturday, Oct 4, 2026",
    queueStatus: "Active",
  };

  const currentlyServing = {
    currentToken: "A-104",
    customer: "Marcus Vance",
    service: "Haircut & Beard Trim",
    station: "Chair 1",
    elapsed: "18 mins in service",
  };

  const queueStats = [
    { label: "Waiting", value: "3" },
    { label: "Serving", value: "1" },
    { label: "Completed", value: "12" },
    { label: "Skipped", value: "1" },
  ];

  const nextCustomers = [
    {
      token: "A-105",
      customer: "Sarah Jenkins",
      service: "Haircut",
      duration: "30 min",
      status: "Waiting in Lobby",
    },
    {
      token: "A-106",
      customer: "David Lee",
      service: "Beard Trim",
      duration: "15 min",
      status: "Checked In",
    },
    {
      token: "A-107",
      customer: "Rohan Mehta",
      service: "Deluxe Package",
      duration: "50 min",
      status: "In Transit",
    },
  ];

  const gracePeriodStages = [
    { label: "Customer Called", status: "completed" },
    { label: "Grace Period (10m)", status: "active" },
    { label: "Waiting", status: "pending" },
    { label: "Skipped", status: "pending" },
  ];

  const customerPanel = {
    customer: "Marcus Vance",
    token: "A-104",
    selectedServices: "Haircut, Beard Trim & Hot Towel Finish",
    estimatedDuration: "45 min",
    bookingInformation: "Walk-in Queue Token &bull; Token generated at 10:12 AM &bull; Checked in station at 10:28 AM",
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans">
      <BusinessNav />

      <main className="flex-grow py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          {/* 1. Queue Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB]">
                Live Operations
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827]">
                Queue Management Desk
              </h1>
              <p className="text-xs text-[#64748B] mt-0.5">
                {queueHeader.businessName} &bull; {queueHeader.date}
              </p>
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
                Queue Status: {queueHeader.queueStatus}
              </span>
            </div>
          </div>

          {/* 6. Queue Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {queueStats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-2xs text-center"
              >
                <span className="text-[11px] font-semibold text-[#64748B] block">
                  {stat.label}
                </span>
                <strong className="text-2xl font-black text-[#111827] mt-0.5 block">
                  {stat.value}
                </strong>
              </div>
            ))}
          </div>

          {/* Main Layout: Operating Station (Left) & Customer Detail Panel (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Currently Serving, Queue Controls, Grace Period, and Next Customers */}
            <div className="lg:col-span-8 space-y-6">
              {/* 2. Currently Serving Block */}
              <div className="bg-white p-6 rounded-xl border-2 border-[#2563EB] shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB]">
                    CURRENTLY SERVING AT {currentlyServing.station}
                  </span>
                  <span className="text-xs text-[#64748B]">
                    {currentlyServing.elapsed}
                  </span>
                </div>

                <div className="flex flex-wrap items-baseline justify-between gap-4 py-2 border-b border-[#E2E8F0]">
                  <div>
                    <span className="text-xs font-semibold text-[#64748B] block">
                      CURRENT TOKEN
                    </span>
                    <strong className="text-5xl font-black text-[#2563EB] tracking-tight block mt-0.5">
                      #{currentlyServing.currentToken}
                    </strong>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs font-semibold text-[#64748B] block">
                      Active Customer
                    </span>
                    <strong className="text-xl font-bold text-[#111827] block mt-0.5">
                      {currentlyServing.customer}
                    </strong>
                    <span className="text-xs text-[#64748B] block mt-0.5">
                      {currentlyServing.service}
                    </span>
                  </div>
                </div>

                {/* 4. Queue Controls */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <button
                    type="button"
                    className="py-2.5 px-3 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-2xs text-center"
                  >
                    Call Next Token
                  </button>

                  <button
                    type="button"
                    className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-2xs text-center"
                  >
                    Complete Service
                  </button>

                  <button
                    type="button"
                    className="py-2.5 px-3 bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#111827] font-semibold text-xs rounded-lg transition-colors text-center"
                  >
                    Skip Customer
                  </button>
                </div>
              </div>

              {/* 5. Grace Period Visualization */}
              <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                    Grace Period Protocol
                  </h2>
                  <span className="text-[11px] text-[#64748B]">
                    Active window: 10 minutes
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {gracePeriodStages.map((stage, idx) => (
                    <div
                      key={stage.label}
                      className={`p-3 rounded-lg border text-center text-xs ${
                        stage.status === "completed"
                          ? "bg-slate-50 border-slate-200 text-[#64748B]"
                          : stage.status === "active"
                          ? "bg-amber-50 border-amber-300 text-amber-800 font-bold"
                          : "bg-[#F8FAFC] border-slate-200 text-[#64748B] opacity-60"
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold block">
                        Phase {idx + 1}
                      </span>
                      <strong className="block mt-1">
                        {stage.label}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Next Customers in Line */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between text-xs">
                  <h2 className="font-bold text-[#111827]">
                    Next in Queue ({nextCustomers.length})
                  </h2>
                  <span className="text-[#64748B]">Ordered by sequence</span>
                </div>

                <div className="divide-y divide-[#E2E8F0]">
                  {nextCustomers.map((cust) => (
                    <div
                      key={cust.token}
                      className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="h-8 w-12 rounded-md bg-[#EFF6FF] text-[#2563EB] font-black flex items-center justify-center text-xs">
                          {cust.token}
                        </span>
                        <div>
                          <strong className="text-[#111827] block">
                            {cust.customer}
                          </strong>
                          <span className="text-[#64748B] text-[11px] block">
                            {cust.service} &bull; Est. {cust.duration}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-[#64748B] border border-slate-200">
                          {cust.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: 7. Customer Information Panel */}
            <div className="lg:col-span-4 sticky top-24">
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs p-5 space-y-4">
                <div className="pb-3 border-b border-[#E2E8F0]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#3730A3]">
                    Customer Dossier
                  </span>
                  <h2 className="text-sm font-bold text-[#111827] mt-0.5">
                    Current Patron Details
                  </h2>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[#64748B] block">Customer Name</span>
                    <strong className="text-sm text-[#111827] block mt-0.5">
                      {customerPanel.customer}
                    </strong>
                  </div>

                  <div>
                    <span className="text-[#64748B] block">Assigned Token</span>
                    <strong className="text-base text-[#2563EB] font-bold block mt-0.5">
                      #{customerPanel.token}
                    </strong>
                  </div>

                  <div>
                    <span className="text-[#64748B] block">Selected Services</span>
                    <p className="text-[#111827] mt-0.5 font-medium leading-relaxed">
                      {customerPanel.selectedServices}
                    </p>
                  </div>

                  <div>
                    <span className="text-[#64748B] block">Estimated Service Time</span>
                    <strong className="text-[#111827] block mt-0.5">
                      ~{customerPanel.estimatedDuration}
                    </strong>
                  </div>

                  <div className="pt-2 border-t border-[#E2E8F0]">
                    <span className="text-[#64748B] block">Booking Information</span>
                    <p className="text-[11px] text-[#64748B] mt-1 leading-relaxed">
                      {customerPanel.bookingInformation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Queue;
