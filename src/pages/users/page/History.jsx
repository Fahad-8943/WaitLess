import UserNav from "../components/UserNav";

function History() {
  const completedServices = [
    {
      id: 1,
      business: "Crown & Blade Studio",
      service: "Haircut & Beard Trim",
      date: "Oct 1, 2026",
      time: "11:00 AM",
      duration: "45 min",
      amount: "₹450",
      status: "Completed",
    },
    {
      id: 2,
      business: "Precision Auto Care",
      service: "Oil Change",
      date: "Sep 24, 2026",
      time: "09:30 AM",
      duration: "30 min",
      amount: "₹450",
      status: "Completed",
    },
    {
      id: 3,
      business: "The Green Fork Bistro",
      service: "Table Reservation",
      date: "Sep 15, 2026",
      time: "07:00 PM",
      duration: "60 min",
      amount: "₹600",
      status: "Completed",
    },
    {
      id: 4,
      business: "L'Aura Hair & Beauty",
      service: "Hair Styling",
      date: "Aug 29, 2026",
      time: "03:30 PM",
      duration: "40 min",
      amount: "₹500",
      status: "Completed",
    },
    {
      id: 5,
      business: "Northside Physio & Training",
      service: "Physio Assessment",
      date: "Aug 10, 2026",
      time: "01:00 PM",
      duration: "45 min",
      amount: "₹700",
      status: "Completed",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans">
      <UserNav />

      <main className="flex-grow py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827]">
              Service History
            </h1>
            <p className="mt-0.5 text-xs sm:text-sm text-[#64748B]">
              Records of completed visits, appointments, and services.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between text-xs">
              <span className="font-semibold text-[#111827]">
                Total Completed Visits: {completedServices.length}
              </span>
              <span className="text-[#64748B]">Sorted by most recent</span>
            </div>

            <div className="divide-y divide-[#E2E8F0]">
              {completedServices.map((item) => (
                <div
                  key={item.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <strong className="text-sm font-bold text-[#111827] block">
                      {item.business}
                    </strong>
                    <p className="text-[#64748B]">
                      {item.service} &bull; Duration: {item.duration}
                    </p>
                    <div className="text-[11px] text-[#64748B]">
                      {item.date} at {item.time}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:text-right">
                    <strong className="text-sm text-[#111827]">
                      {item.amount}
                    </strong>
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default History;
