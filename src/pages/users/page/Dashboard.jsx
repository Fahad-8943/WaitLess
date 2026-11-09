import { Link } from "react-router";
import UserNav from "../components/UserNav";

function Dashboard() {
  const currentQueue = {
    business: "Crown & Blade Studio",
    service: "Haircut & Beard Grooming",
    yourToken: "A-18",
    currentToken: "A-14",
    peopleAhead: 3,
    estimatedWaitingTime: "14 mins",
    status: "Active",
  };

  const upcomingBooking = {
    business: "Apex Dental & Wellness",
    service: "Dental Checkup",
    date: "Tomorrow, Oct 5, 2026",
    time: "10:30 AM",
    status: "Confirmed",
  };

  const recentActivity = [
    {
      id: 1,
      business: "Crown & Blade Studio",
      service: "Haircut",
      date: "Oct 1, 2026",
      status: "Completed",
    },
    {
      id: 2,
      business: "Precision Auto Care",
      service: "Oil Change",
      date: "Sep 24, 2026",
      status: "Completed",
    },
    {
      id: 3,
      business: "L'Aura Hair & Beauty",
      service: "Hair Styling",
      date: "Sep 12, 2026",
      status: "Completed",
    },
  ];

  const recommendedBusinesses = [
    {
      id: "green-fork",
      name: "The Green Fork Bistro",
      category: "Restaurants",
      rating: "4.6",
      waitTime: "15 mins",
    },
    {
      id: "precision-auto",
      name: "Precision Auto Care",
      category: "Repair",
      rating: "4.7",
      waitTime: "30 mins",
    },
    {
      id: "laura-salon",
      name: "L'Aura Hair & Beauty",
      category: "Salons",
      rating: "4.9",
      waitTime: "25 mins",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans">
      <UserNav />

      <main className="flex-grow py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          {/* 1. Welcome Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827]">
                Customer Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
                Overview of your live queue status and scheduled appointments.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/discover"
                className="px-3.5 py-2 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-2xs"
              >
                Find a Service
              </Link>
            </div>
          </div>

          {/* 2. Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              to="/discover"
              className="p-4 bg-white rounded-xl border border-[#E2E8F0] hover:border-blue-300 shadow-2xs transition-colors flex items-center justify-between"
            >
              <div>
                <span className="block text-sm font-bold text-[#111827]">
                  Find a Service
                </span>
                <span className="block text-xs text-[#64748B] mt-0.5">
                  Browse local providers
                </span>
              </div>
              <span className="text-[#2563EB] text-sm font-bold">&rarr;</span>
            </Link>

            <Link
              to="/user/bookings"
              className="p-4 bg-white rounded-xl border border-[#E2E8F0] hover:border-blue-300 shadow-2xs transition-colors flex items-center justify-between"
            >
              <div>
                <span className="block text-sm font-bold text-[#111827]">
                  My Bookings
                </span>
                <span className="block text-xs text-[#64748B] mt-0.5">
                  Manage appointments
                </span>
              </div>
              <span className="text-[#2563EB] text-sm font-bold">&rarr;</span>
            </Link>

            <Link
              to="/user/queue"
              className="p-4 bg-white rounded-xl border border-[#E2E8F0] hover:border-blue-300 shadow-2xs transition-colors flex items-center justify-between"
            >
              <div>
                <span className="block text-sm font-bold text-[#111827]">
                  Join a Queue
                </span>
                <span className="block text-xs text-[#64748B] mt-0.5">
                  Check live token status
                </span>
              </div>
              <span className="text-[#2563EB] text-sm font-bold">&rarr;</span>
            </Link>
          </div>

          {/* Two-Column Layout: Live Queue & Upcoming Booking */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* 3. Current Queue Card */}
            <div className="lg:col-span-7 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB]">
                    Live Queue Card
                  </span>
                  <h2 className="text-base font-bold text-[#111827] mt-0.5">
                    {currentQueue.business}
                  </h2>
                  <p className="text-xs text-[#64748B]">{currentQueue.service}</p>
                </div>
                <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {currentQueue.status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg text-center">
                  <span className="text-[10px] font-bold text-[#2563EB] uppercase block">
                    Your Token
                  </span>
                  <strong className="text-2xl font-black text-[#2563EB] mt-1 block">
                    #{currentQueue.yourToken}
                  </strong>
                </div>

                <div className="p-3 bg-slate-50 border border-[#E2E8F0] rounded-lg text-center">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase block">
                    Now Serving
                  </span>
                  <strong className="text-2xl font-black text-[#111827] mt-1 block">
                    #{currentQueue.currentToken}
                  </strong>
                </div>

                <div className="p-3 bg-slate-50 border border-[#E2E8F0] rounded-lg text-center">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase block">
                    People Ahead
                  </span>
                  <strong className="text-2xl font-black text-[#111827] mt-1 block">
                    {currentQueue.peopleAhead}
                  </strong>
                </div>

                <div className="p-3 bg-slate-50 border border-[#E2E8F0] rounded-lg text-center">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase block">
                    Est. Wait
                  </span>
                  <strong className="text-base font-black text-[#0891B2] mt-2 block">
                    {currentQueue.estimatedWaitingTime}
                  </strong>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <Link
                  to="/user/queue"
                  className="text-xs font-bold text-[#2563EB] hover:underline"
                >
                  Open Live Queue Tracker &rarr;
                </Link>
                <span className="text-xs text-[#64748B]">
                  Grace period: 10 mins upon call
                </span>
              </div>
            </div>

            {/* 4. Upcoming Booking Card */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#3730A3]">
                    Upcoming Booking
                  </span>
                  <h2 className="text-base font-bold text-[#111827] mt-0.5">
                    {upcomingBooking.business}
                  </h2>
                </div>
                <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                  {upcomingBooking.status}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-[#E2E8F0]">
                  <span className="text-[#64748B]">Service</span>
                  <strong className="text-[#111827]">{upcomingBooking.service}</strong>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-[#E2E8F0]">
                  <span className="text-[#64748B]">Date</span>
                  <strong className="text-[#111827]">{upcomingBooking.date}</strong>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-[#64748B]">Time Slot</span>
                  <strong className="text-[#111827]">{upcomingBooking.time}</strong>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/user/bookings"
                  className="block w-full py-2 px-3 text-center rounded-lg bg-slate-50 hover:bg-slate-100 border border-[#E2E8F0] text-xs font-semibold text-[#111827] transition-colors"
                >
                  Manage Bookings
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Grid: Recent Activity & Recommended Businesses */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* 5. Recent Activity */}
            <div className="lg:col-span-7 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs p-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <h2 className="text-sm font-bold text-[#111827]">
                  Recent Activity
                </h2>
                <Link to="/user/history" className="text-xs text-[#2563EB] hover:underline">
                  View all
                </Link>
              </div>

              <div className="divide-y divide-[#E2E8F0]">
                {recentActivity.map((act) => (
                  <div
                    key={act.id}
                    className="py-3 first:pt-3 last:pb-0 flex items-center justify-between text-xs"
                  >
                    <div>
                      <strong className="text-[#111827] block">
                        {act.business}
                      </strong>
                      <span className="text-[#64748B] mt-0.5 block">
                        {act.service} • {act.date}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {act.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Recommended Businesses */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs p-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <h2 className="text-sm font-bold text-[#111827]">
                  Nearby Places
                </h2>
                <Link to="/discover" className="text-xs text-[#2563EB] hover:underline">
                  Explore
                </Link>
              </div>

              <div className="divide-y divide-[#E2E8F0]">
                {recommendedBusinesses.map((rec) => (
                  <div
                    key={rec.id}
                    className="py-3 first:pt-3 last:pb-0 flex items-center justify-between text-xs"
                  >
                    <div>
                      <strong className="text-[#111827] block">{rec.name}</strong>
                      <span className="text-[#64748B] mt-0.5 block">
                        {rec.category} • ★ {rec.rating}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[#2563EB] font-bold block">
                        ~{rec.waitTime}
                      </span>
                      <Link
                        to={`/business/${rec.id}`}
                        className="text-xs text-[#64748B] hover:text-[#111827] hover:underline"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
