import BusinessNav from "../components/BusinessNav";

function Bookings() {
  const bookingsList = [
    {
      id: 1,
      customer: "Marcus Vance",
      service: "Haircut & Beard Trim",
      date: "Today, Oct 4, 2026",
      time: "10:30 AM",
      duration: "45 min",
      status: "Confirmed",
    },
    {
      id: 2,
      customer: "Sarah Jenkins",
      service: "Haircut",
      date: "Today, Oct 4, 2026",
      time: "11:15 AM",
      duration: "30 min",
      status: "Confirmed",
    },
    {
      id: 3,
      customer: "David Lee",
      service: "Beard Trim",
      date: "Today, Oct 4, 2026",
      time: "01:00 PM",
      duration: "15 min",
      status: "Confirmed",
    },
    {
      id: 4,
      customer: "Rohan Mehta",
      service: "Deluxe Package",
      date: "Today, Oct 4, 2026",
      time: "02:30 PM",
      duration: "50 min",
      status: "Confirmed",
    },
    {
      id: 5,
      customer: "Priya Sharma",
      service: "Hair Wash & Styling",
      date: "Tomorrow, Oct 5, 2026",
      time: "10:00 AM",
      duration: "20 min",
      status: "Confirmed",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans">
      <BusinessNav />

      <main className="flex-grow py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827]">
                Bookings Schedule
              </h1>
              <p className="mt-0.5 text-xs sm:text-sm text-[#64748B]">
                View and manage incoming customer appointments.
              </p>
            </div>
            <span className="text-xs text-[#64748B]">
              Total Bookings: <strong>{bookingsList.length}</strong>
            </span>
          </div>

          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Time Slot</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {bookingsList.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#111827]">
                        {b.customer}
                      </td>
                      <td className="py-3.5 px-4 text-[#64748B]">
                        {b.service} ({b.duration})
                      </td>
                      <td className="py-3.5 px-4 text-[#111827]">
                        {b.date}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#2563EB]">
                        {b.time}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-[#E2E8F0]">
              {bookingsList.map((b) => (
                <div key={b.id} className="p-4 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <strong className="text-sm font-bold text-[#111827]">
                      {b.customer}
                    </strong>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                      {b.status}
                    </span>
                  </div>
                  <p className="text-[#64748B]">{b.service}</p>
                  <div className="flex items-center justify-between text-[#111827] pt-1">
                    <span>{b.date}</span>
                    <strong className="text-[#2563EB]">{b.time}</strong>
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

export default Bookings;
