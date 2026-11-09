import UserNav from "../components/UserNav";

function Queue() {
  const queueData = {
    businessName: "Crown & Blade Studio",
    service: "Haircut & Beard Grooming",
    yourToken: "A-18",
    currentToken: "A-14",
    peopleAhead: 3,
    estimatedWaitingTime: "14 mins",
    queueStatus: "In Line",
    selectedServices: [
      { name: "Haircut", duration: "30 min" },
      { name: "Beard Trim", duration: "15 min" },
    ],
    estimatedServiceDuration: "45 mins",
  };

  const gracePeriodStages = [
    { name: "Token Called", desc: "Counter announces your token", status: "upcoming" },
    { name: "Grace Period", desc: "10-minute arrival window active", status: "upcoming" },
    { name: "Waiting", desc: "Staff holds your spot at station", status: "upcoming" },
    { name: "Skipped", desc: "Token released if absent after grace period", status: "pending" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans">
      <UserNav />

      <main className="flex-grow py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                Live Queue Tracker
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827]">
                {queueData.businessName}
              </h1>
              <p className="text-xs text-[#64748B] mt-0.5">
                {queueData.service}
              </p>
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                <span className="h-2 w-2 rounded-full bg-[#2563EB]"></span>
                Status: {queueData.queueStatus}
              </span>
            </div>
          </div>

          {/* High Visual Hierarchy: Token Status Block */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* YOUR TOKEN */}
            <div className="bg-[#EFF6FF] border-2 border-[#2563EB] rounded-xl p-4 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] block">
                Your Token
              </span>
              <strong className="text-3xl sm:text-4xl font-black text-[#2563EB] mt-1 block">
                #{queueData.yourToken}
              </strong>
              <span className="text-xs font-medium text-[#2563EB]">Assigned</span>
            </div>

            {/* CURRENT TOKEN */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] block">
                Current Token
              </span>
              <strong className="text-3xl sm:text-4xl font-black text-[#111827] mt-1 block">
                #{queueData.currentToken}
              </strong>
              <span className="text-xs text-[#64748B]">Serving now</span>
            </div>

            {/* PEOPLE AHEAD */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] block">
                People Ahead
              </span>
              <strong className="text-3xl sm:text-4xl font-black text-[#111827] mt-1 block">
                {queueData.peopleAhead}
              </strong>
              <span className="text-xs text-[#64748B]">In queue</span>
            </div>

            {/* ESTIMATED WAITING TIME */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] block">
                Estimated Wait
              </span>
              <strong className="text-2xl sm:text-3xl font-black text-[#0891B2] mt-2 block">
                {queueData.estimatedWaitingTime}
              </strong>
              <span className="text-xs text-[#64748B]">Approximate</span>
            </div>
          </div>

          {/* Selected Services & Duration */}
          <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-2xs space-y-3">
            <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
              Selected Services &amp; Duration
            </h2>

            <div className="divide-y divide-[#E2E8F0] text-xs">
              {queueData.selectedServices.map((svc) => (
                <div
                  key={svc.name}
                  className="py-2.5 first:pt-1 last:pb-1 flex items-center justify-between"
                >
                  <span className="font-semibold text-[#111827]">{svc.name}</span>
                  <span className="text-[#64748B]">Est. {svc.duration}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-bold">
              <span className="text-[#111827]">Combined Service Duration</span>
              <span className="text-[#2563EB]">{queueData.estimatedServiceDuration}</span>
            </div>
          </div>

          {/* Grace Period Policy Visualization */}
          <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                No-Show Grace Period Protocol
              </h2>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                10-Minute Policy
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-1">
              {gracePeriodStages.map((stage, idx) => (
                <div
                  key={stage.name}
                  className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs"
                >
                  <span className="text-xs font-bold text-[#3730A3] block">
                    Phase {idx + 1}
                  </span>
                  <strong className="text-xs font-bold text-[#111827] mt-0.5 block">
                    {stage.name}
                  </strong>
                  <span className="text-xs text-[#64748B] mt-1 block leading-normal">
                    {stage.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Control: Cancel Queue Token */}
          <div className="pt-2 text-center">
            <button
              type="button"
              className="min-h-[44px] px-5 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 font-semibold rounded-lg text-xs transition-colors inline-flex items-center justify-center"
            >
              Cancel Queue Token
            </button>
            <p className="text-xs text-[#64748B] mt-1.5">
              Releases your token so next in line can be served.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Queue;
