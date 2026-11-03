import UserNav from "../components/UserNav";

function Bookings() {
  // Static visual data representing available services
  const availableServices = [
    { id: 1, name: "Haircut", duration: "30 min", price: "₹300", desc: "Classic cut & precision neck shave", defaultChecked: true },
    { id: 2, name: "Beard Trim & Sculpt", duration: "15 min", price: "₹150", desc: "Line definition and beard oil treatment", defaultChecked: true },
    { id: 3, name: "Hot Towel Shave", duration: "25 min", price: "₹400", desc: "Traditional straight-edge lather shave", defaultChecked: false },
    { id: 4, name: "Scalp Massage & Wash", duration: "20 min", price: "₹250", desc: "Invigorating cleanse and custom styling", defaultChecked: false },
  ];

  const availableSlots = [
    "09:30 AM",
    "10:30 AM",
    "11:15 AM",
    "02:00 PM",
    "03:30 PM",
    "04:45 PM",
  ];

  const upcomingBookings = [
    {
      id: 101,
      business: "Apex Dental & Wellness",
      services: "Dental Checkup",
      duration: "30 min",
      date: "Tomorrow, Oct 5, 2026",
      time: "10:30 AM",
      status: "Confirmed",
    },
    {
      id: 102,
      business: "L'Aura Hair & Beauty",
      services: "Haircut & Blowout",
      duration: "45 min",
      date: "Oct 12, 2026",
      time: "02:00 PM",
      status: "Confirmed",
    },
  ];

  const pastBookings = [
    {
      id: 201,
      business: "Crown & Blade Studio",
      services: "Haircut & Beard Trim",
      date: "Oct 1, 2026",
      time: "11:00 AM",
      status: "Completed",
    },
    {
      id: 202,
      business: "Precision Auto Care",
      services: "Oil Change",
      date: "Sep 24, 2026",
      time: "09:30 AM",
      status: "Completed",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans">
      <UserNav />

      <main className="flex-grow py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827]">
              Service Booking &amp; Appointments
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#64748B]">
              Configure service selections, view durations, and review confirmed bookings.
            </p>
          </div>

          {/* Core Booking Interface: Service Selection + Slot + Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Service Selection & Available Slots */}
            <div className="lg:col-span-7 space-y-6">
              {/* 1. Multiple Service Selection UI */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB]">
                      Step 1
                    </span>
                    <h2 className="text-sm sm:text-base font-bold text-[#111827]">
                      Service Selection
                    </h2>
                  </div>
                  <span className="text-xs text-[#64748B]">
                    Venue: <strong>Crown &amp; Blade</strong>
                  </span>
                </div>

                <div className="space-y-2.5">
                  {availableServices.map((svc) => (
                    <div
                      key={svc.id}
                      className={`p-3.5 rounded-lg border transition-colors flex items-start justify-between gap-3 ${
                        svc.defaultChecked
                          ? "border-[#2563EB] bg-[#EFF6FF]/40"
                          : "border-[#E2E8F0]"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          defaultChecked={svc.defaultChecked}
                          className="mt-0.5 h-4 w-4 rounded border-[#E2E8F0] text-[#2563EB] focus:ring-[#2563EB]"
                        />
                        <div>
                          <strong className="text-xs sm:text-sm text-[#111827] block">
                            {svc.name}
                          </strong>
                          <span className="text-[11px] text-[#64748B] block mt-0.5">
                            {svc.desc}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <strong className="text-xs sm:text-sm text-[#111827] block">
                          {svc.price}
                        </strong>
                        <span className="text-[11px] text-[#2563EB] font-medium block">
                          ~{svc.duration}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Available Slot Picker UI */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#3730A3]">
                      Step 2
                    </span>
                    <h2 className="text-sm sm:text-base font-bold text-[#111827]">
                      Available Slot
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#111827] mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      defaultValue="2026-10-06"
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-xs text-[#111827] focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#111827] mb-1">
                      Available Time Slots
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {availableSlots.map((slot, idx) => (
                        <button
                          key={slot}
                          type="button"
                          className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-colors ${
                            idx === 1
                              ? "bg-[#2563EB] text-white border-[#2563EB]"
                              : "bg-white text-[#111827] border-[#E2E8F0] hover:bg-slate-50"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Booking Summary Card UI */}
            <div className="lg:col-span-5 sticky top-24">
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs p-5 space-y-4">
                <div className="pb-3 border-b border-[#E2E8F0]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB]">
                    Booking Summary
                  </span>
                  <h2 className="text-base font-bold text-[#111827] mt-0.5">
                    Appointment Details
                  </h2>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                    <span className="text-[#64748B]">Venue</span>
                    <strong className="text-[#111827]">Crown &amp; Blade Studio</strong>
                  </div>

                  <div className="py-1 border-b border-[#E2E8F0]">
                    <span className="text-[#64748B] block mb-1">Selected Services:</span>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[#111827]">
                        <span>&bull; Haircut (30 min)</span>
                        <span>₹300</span>
                      </div>
                      <div className="flex justify-between text-[#111827]">
                        <span>&bull; Beard Trim &amp; Sculpt (15 min)</span>
                        <span>₹150</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                    <span className="text-[#64748B]">Total Estimated Duration</span>
                    <strong className="text-[#2563EB]">45 mins</strong>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                    <span className="text-[#64748B]">Date &amp; Slot</span>
                    <strong className="text-[#111827]">Oct 6, 2026 at 10:30 AM</strong>
                  </div>

                  <div className="flex justify-between py-2 text-sm font-extrabold text-[#111827]">
                    <span>Total Amount</span>
                    <span>₹450</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full py-2.5 px-4 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition-colors shadow-2xs"
                >
                  Confirm Booking Slot
                </button>
              </div>
            </div>
          </div>

          {/* Confirmed & Past Bookings Section */}
          <div className="space-y-4 pt-4 border-t border-[#E2E8F0]">
            <h2 className="text-base font-bold text-[#111827]">
              My Scheduled Appointments
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-2xs flex items-start justify-between text-xs"
                >
                  <div className="space-y-1">
                    <strong className="text-sm text-[#111827] block">{b.business}</strong>
                    <span className="text-[#64748B] block">{b.services} &bull; {b.duration}</span>
                    <span className="text-[#111827] font-semibold block">{b.date} &bull; {b.time}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                    {b.status}
                  </span>
                </div>
              ))}
            </div>

            <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider pt-2">
              Past Appointments
            </h3>
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs divide-y divide-[#E2E8F0]">
              {pastBookings.map((pb) => (
                <div key={pb.id} className="p-3.5 flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-[#111827]">{pb.business}</strong>
                    <span className="text-[#64748B] ml-2">{pb.services} &bull; {pb.date}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {pb.status}
                  </span>
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
