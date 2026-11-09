import { Link } from "react-router";
import BusinessNav from "../components/BusinessNav";

function Dashboard() {
  const stats = [
    { label: "Today's Bookings", value: "8" },
    { label: "Customers Waiting", value: "3" },
    { label: "Currently Serving", value: "#A-14" },
    { label: "Completed Today", value: "12" },
  ];

  const currentQueueSummary = {
    currentToken: "A-14",
    nextToken: "A-15",
    waitingCount: 3,
    estimatedWait: "14 mins",
    status: "Active",
  };

  const todaysBookings = [
    {
      id: 1,
      customer: "Marcus Vance",
      service: "Haircut & Beard Trim",
      time: "10:30 AM",
      status: "In Progress",
    },
    {
      id: 2,
      customer: "Sarah Jenkins",
      service: "Haircut",
      time: "11:15 AM",
      status: "Confirmed",
    },
    {
      id: 3,
      customer: "David Lee",
      service: "Beard Trim",
      time: "01:00 PM",
      status: "Confirmed",
    },
    {
      id: 4,
      customer: "Rohan Mehta",
      service: "Deluxe Package",
      time: "02:30 PM",
      status: "Confirmed",
    },
  ];

  const popularServices = [
    {
      name: "Haircut",
      price: "₹300",
      duration: "30 min",
      bookingsCount: "24 this week",
    },
    {
      name: "Beard Trim",
      price: "₹150",
      duration: "15 min",
      bookingsCount: "18 this week",
    },
    {
      name: "Hot Towel Shave",
      price: "₹400",
      duration: "25 min",
      bookingsCount: "9 this week",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans">
      <BusinessNav />

      <main className="flex-grow py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827]">
                Business Overview
              </h1>
              <p className="mt-0.5 text-xs sm:text-sm text-[#64748B]">
                Daily operational summary for Crown &amp; Blade Studio.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/business/queue"
                className="px-3.5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-2xs"
              >
                Open Queue Desk
              </Link>
            </div>
          </div>

          {/* 1. Overview Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-2xs"
              >
                <span className="text-[11px] font-semibold text-[#64748B] block">
                  {s.label}
                </span>
                <strong className="text-2xl font-black text-[#111827] mt-1 block">
                  {s.value}
                </strong>
              </div>
            ))}
          </div>

          {/* 2. Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              to="/business/services"
              className="p-3 bg-white rounded-xl border border-[#E2E8F0] hover:border-blue-300 shadow-2xs transition-colors text-center font-bold text-xs text-[#111827]"
            >
              + Add Service
            </Link>
            <Link
              to="/business/queue"
              className="p-3 bg-white rounded-xl border border-[#E2E8F0] hover:border-blue-300 shadow-2xs transition-colors text-center font-bold text-xs text-[#111827]"
            >
              View Live Queue
            </Link>
            <Link
              to="/business/bookings"
              className="p-3 bg-white rounded-xl border border-[#E2E8F0] hover:border-blue-300 shadow-2xs transition-colors text-center font-bold text-xs text-[#111827]"
            >
              View Bookings
            </Link>
            <Link
              to="/business/profile"
              className="p-3 bg-white rounded-xl border border-[#E2E8F0] hover:border-blue-300 shadow-2xs transition-colors text-center font-bold text-xs text-[#111827]"
            >
              Edit Business Info
            </Link>
          </div>

          {/* Main Grid: Queue Summary + Today's Bookings */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* 3. Current Queue Summary */}
            <div className="lg:col-span-6 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB]">
                    Active Station
                  </span>
                  <h2 className="text-sm font-bold text-[#111827] mt-0.5">
                    Queue Summary
                  </h2>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {currentQueueSummary.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg">
                  <span className="text-[10px] font-bold text-[#2563EB] uppercase block">
                    Current Token
                  </span>
                  <strong className="text-2xl font-black text-[#2563EB] mt-1 block">
                    #{currentQueueSummary.currentToken}
                  </strong>
                </div>

                <div className="p-3 bg-slate-50 border border-[#E2E8F0] rounded-lg">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase block">
                    Next Up
                  </span>
                  <strong className="text-2xl font-black text-[#111827] mt-1 block">
                    #{currentQueueSummary.nextToken}
                  </strong>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 border border-[#E2E8F0] rounded-lg text-xs">
                <span className="text-[#64748B]">
                  Waiting: <strong>{currentQueueSummary.waitingCount} customers</strong>
                </span>
                <span className="text-[#2563EB] font-bold">
                  Est. Wait: ~{currentQueueSummary.estimatedWait}
                </span>
              </div>

              <div className="pt-1">
                <Link
                  to="/business/queue"
                  className="block w-full py-2 text-center rounded-lg bg-slate-50 hover:bg-slate-100 border border-[#E2E8F0] text-xs font-semibold text-[#111827] transition-colors"
                >
                  Manage Live Queue Desk &rarr;
                </Link>
              </div>
            </div>

            {/* 4. Today's Bookings */}
            <div className="lg:col-span-6 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <h2 className="text-sm font-bold text-[#111827]">
                  Today's Scheduled Appointments
                </h2>
                <Link
                  to="/business/bookings"
                  className="text-xs text-[#2563EB] hover:underline"
                >
                  All Bookings
                </Link>
              </div>

              <div className="divide-y divide-[#E2E8F0]">
                {todaysBookings.map((b) => (
                  <div
                    key={b.id}
                    className="py-2.5 first:pt-1 last:pb-1 flex items-center justify-between text-xs"
                  >
                    <div>
                      <strong className="text-[#111827] block">{b.customer}</strong>
                      <span className="text-[#64748B] text-xs block mt-0.5">
                        {b.service} • {b.time}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        b.status === "In Progress"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-slate-100 text-[#64748B] border border-slate-200"
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5. Popular Services */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <h2 className="text-sm font-bold text-[#111827]">
                Popular Services
              </h2>
              <Link
                to="/business/services"
                className="text-xs text-[#2563EB] hover:underline"
              >
                Manage Services
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
              {popularServices.map((svc) => (
                <div
                  key={svc.name}
                  className="p-3.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-xs space-y-1"
                >
                  <strong className="text-sm font-bold text-[#111827] block">
                    {svc.name}
                  </strong>
                  <div className="flex items-center justify-between text-[#64748B]">
                    <span>{svc.price}</span>
                    <span>~{svc.duration}</span>
                  </div>
                  <span className="text-[11px] text-[#2563EB] block pt-1 font-medium">
                    {svc.bookingsCount}
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

export default Dashboard;
