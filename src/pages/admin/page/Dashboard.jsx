import { Link } from "react-router";
import AdminNav from "../components/AdminNav";

function Dashboard() {
  const stats = [
    { label: "Pending Applications", value: "2", alert: true, path: "/admin/businesses" },
    { label: "Active Businesses", value: "18", alert: false, path: "/admin/businesses" },
    { label: "Total Customers", value: "64", alert: false, path: "/admin/users" },
    { label: "Total Businesses", value: "20", alert: false, path: "/admin/businesses" },
  ];

  const recentActivity = [
    {
      type: "Business Application",
      title: "Metro Smile Dental",
      detail: "Submitted new business application",
      time: "20 mins ago",
      badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
      action: "Review Business",
      link: "/admin/businesses/metro-smile",
    },
    {
      type: "Customer Registration",
      title: "Priya Sharma",
      detail: "Created new customer account (Downtown Metro)",
      time: "45 mins ago",
      badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
      action: null,
      link: null,
    },
    {
      type: "Review",
      title: "Crown & Blade Studio",
      detail: "Received customer review",
      time: "2 hours ago",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
      action: "Review",
      link: "/admin/reviews",
    },
    {
      type: "Report",
      title: "System Status",
      detail: "Daily queue status nominal",
      time: "4 hours ago",
      badgeClass: "bg-slate-100 text-[#64748B] border-slate-200",
      action: null,
      link: null,
    },
    {
      type: "Business Application",
      title: "Velocity Auto Care",
      detail: "Submitted new business application",
      time: "Yesterday",
      badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
      action: "Review Business",
      link: "/admin/businesses/velocity-auto",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans">
      <AdminNav />

      <main className="flex-grow py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827]">
                Platform Administration
              </h1>
              <p className="mt-0.5 text-xs sm:text-sm text-[#64748B]">
                Review business applications, user accounts, and platform operations.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
                System Operational
              </span>
            </div>
          </div>

          {/* 1. Overview Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((s) => (
              <Link
                key={s.label}
                to={s.path}
                className={`p-4 rounded-xl border transition-colors shadow-2xs ${
                  s.alert
                    ? "bg-amber-50/50 border-amber-200 hover:border-amber-300"
                    : "bg-white border-[#E2E8F0] hover:border-blue-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#64748B] block">
                    {s.label}
                  </span>
                  {s.alert && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                      Action Needed
                    </span>
                  )}
                </div>
                <strong className={`text-2xl font-black mt-1 block ${s.alert ? "text-amber-800" : "text-[#111827]"}`}>
                  {s.value}
                </strong>
              </Link>
            ))}
          </div>

          {/* 2. Recent Platform Activity */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between text-xs">
              <div>
                <h2 className="font-bold text-[#111827]">
                  Recent Platform Activity
                </h2>
                <span className="text-[#64748B]">
                  Audit log of registrations, applications, and reviews
                </span>
              </div>
              <span className="text-[#64748B]">Recent</span>
            </div>

            <div className="divide-y divide-[#E2E8F0]">
              {recentActivity.map((act, idx) => (
                <div
                  key={idx}
                  className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${act.badgeClass}`}>
                        {act.type}
                      </span>
                      <strong className="text-[#111827]">{act.title}</strong>
                    </div>
                    <p className="text-[#64748B] text-[11px]">{act.detail}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-[#64748B]">{act.time}</span>
                    {act.action && (
                      <Link
                        to={act.link}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[#111827] font-semibold text-[11px] transition-colors"
                      >
                        {act.action}
                      </Link>
                    )}
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

export default Dashboard;
