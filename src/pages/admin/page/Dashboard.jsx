import { useState, useEffect } from "react";
import { Link } from "react-router";
import AdminNav from "../components/AdminNav";
import { adminApi } from "../../../api/auth";

function formatRelativeTime(timestamp) {
  if (!timestamp) return "Just now";
  const diffMs = Date.now() - timestamp;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDays = Math.floor(diffHour / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function Dashboard() {
  const [statsData, setStatsData] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadTrigger, setReloadTrigger] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      setLoading(true);
      setError("");
      try {
        const [statsRes, bizRes, usersRes] = await Promise.all([
          adminApi.getPlatformStats(),
          adminApi.listBusinesses({ limit: 5 }),
          adminApi.listUsers({ limit: 5 }),
        ]);

        if (!isMounted) return;

        if (statsRes?.data) {
          setStatsData(statsRes.data);
        }

        const activities = [];

        const businesses = bizRes?.data || [];
        for (const biz of businesses) {
          const isPending = biz.approvalStatus === "pending";
          const isSuspended = biz.approvalStatus === "suspended";
          const city = biz.address?.city || "";
          activities.push({
            id: `biz-${biz._id}`,
            createdAt: new Date(biz.createdAt || Date.now()).getTime(),
            type: isPending ? "Business Application" : isSuspended ? "Suspended Venue" : "Approved Business",
            title: biz.name,
            detail: isPending
              ? `Submitted application in ${city ? `${city} • ` : ""}${biz.category || "Service"}`
              : `Active venue in ${city || "Registered"} (${biz.approvalStatus})`,
            badgeClass: isPending
              ? "bg-amber-50 text-amber-800 border-amber-200"
              : isSuspended
              ? "bg-rose-50 text-rose-800 border-rose-200"
              : "bg-emerald-50 text-emerald-700 border-emerald-200",
            action: isPending ? "Review Business" : "View Business",
            link: `/admin/businesses/${biz._id}`,
          });
        }

        const users = usersRes?.data || [];
        for (const u of users) {
          const isProvider = u.role === "provider";
          const isAdmin = u.role === "admin";
          activities.push({
            id: `user-${u._id}`,
            createdAt: new Date(u.createdAt || Date.now()).getTime(),
            type: isAdmin ? "Admin Account" : isProvider ? "Provider Account" : "Customer Registration",
            title: u.name,
            detail: `Registered ${u.role} account (${u.email || u.phone || ""})`,
            badgeClass: isAdmin
              ? "bg-amber-50 text-amber-800 border-amber-200"
              : isProvider
              ? "bg-purple-50 text-purple-700 border-purple-200"
              : "bg-blue-50 text-blue-700 border-blue-200",
            action: "View Users",
            link: "/admin/users",
          });
        }

        activities.sort((a, b) => b.createdAt - a.createdAt);
        setRecentActivity(activities.slice(0, 6));
      } catch (err) {
        if (!isMounted) return;
        setError(err?.message || "Failed to load platform statistics.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDashboard();
    return () => {
      isMounted = false;
    };
  }, [reloadTrigger]);

  const pendingCount = statsData?.businesses?.byApprovalStatus?.pending ?? 0;
  const activeBizCount = statsData?.businesses?.byApprovalStatus?.approved ?? statsData?.businesses?.active ?? 0;
  const customerCount = statsData?.users?.byRole?.customer ?? 0;
  const totalBizCount = statsData?.businesses?.total ?? 0;

  const stats = [
    { label: "Pending Applications", value: String(pendingCount), alert: pendingCount > 0, path: "/admin/businesses" },
    { label: "Active Businesses", value: String(activeBizCount), alert: false, path: "/admin/businesses" },
    { label: "Total Customers", value: String(customerCount), alert: false, path: "/admin/users" },
    { label: "Total Businesses", value: String(totalBizCount), alert: false, path: "/admin/businesses" },
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
              <button
                type="button"
                onClick={() => setReloadTrigger((c) => c + 1)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-white hover:bg-slate-50 text-[#111827] border border-[#E2E8F0] shadow-2xs transition-colors cursor-pointer"
              >
                ↻ Refresh
              </button>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
                System Operational
              </span>
            </div>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center justify-between">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => setReloadTrigger((c) => c + 1)}
                className="px-2 py-0.5 bg-rose-100 hover:bg-rose-200 text-rose-900 rounded font-semibold cursor-pointer ml-3"
              >
                Retry
              </button>
            </div>
          )}

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
                  {loading ? "…" : s.value}
                </strong>
              </Link>
            ))}
          </div>

          {/* Additional Platform Operational Summary Strip */}
          {statsData && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-2xs text-xs">
              <div>
                <span className="text-[#64748B] text-[11px] block">Today's Bookings</span>
                <strong className="text-base text-[#111827]">
                  {statsData.bookings?.todayCount ?? 0}
                </strong>
                <span className="text-[10px] text-[#64748B] block">Total: {statsData.bookings?.total ?? 0}</span>
              </div>
              <div>
                <span className="text-[#64748B] text-[11px] block">Active Queue Entries</span>
                <strong className="text-base text-[#2563EB]">
                  {statsData.queue?.totalActive ?? 0}
                </strong>
                <span className="text-[10px] text-[#64748B] block">Waiting: {statsData.queue?.waiting ?? 0} • Called: {statsData.queue?.called ?? 0}</span>
              </div>
              <div>
                <span className="text-[#64748B] text-[11px] block">Platform Providers</span>
                <strong className="text-base text-purple-700">
                  {statsData.users?.byRole?.provider ?? 0}
                </strong>
                <span className="text-[10px] text-[#64748B] block">Active users: {statsData.users?.active ?? 0}</span>
              </div>
              <div>
                <span className="text-[#64748B] text-[11px] block">Platform Services</span>
                <strong className="text-base text-emerald-700">
                  {statsData.services?.active ?? 0}
                </strong>
                <span className="text-[10px] text-[#64748B] block">Catalog total: {statsData.services?.total ?? 0}</span>
              </div>
            </div>
          )}

          {/* 2. Recent Platform Activity */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between text-xs">
              <div>
                <h2 className="font-bold text-[#111827]">
                  Recent Platform Activity
                </h2>
                <span className="text-[#64748B]">
                  Audit log of registrations and business applications
                </span>
              </div>
              <span className="text-[#64748B]">Recent</span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-[#64748B] space-y-2">
                <div className="inline-block h-6 w-6 rounded-full border-2 border-[#2563EB] border-t-transparent animate-spin" />
                <p>Loading platform audit records...</p>
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#64748B]">
                No recent activity records found on the platform.
              </div>
            ) : (
              <div className="divide-y divide-[#E2E8F0]">
                {recentActivity.map((act) => (
                  <div
                    key={act.id}
                    className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-50/50 transition-colors"
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
                      <span className="text-[11px] text-[#64748B]">{formatRelativeTime(act.createdAt)}</span>
                      {act.action && act.link && (
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
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
