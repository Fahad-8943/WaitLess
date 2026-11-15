import { useState, useEffect } from "react";
import { Link } from "react-router";
import BusinessNav from "../components/BusinessNav";
import BusinessSwitcher from "../components/BusinessSwitcher";
import { useProviderBusiness } from "../hooks/useProviderBusiness";
import { providerApi } from "../../../api/auth";

function Dashboard() {
  const {
    businesses,
    selectedBusinessId,
    selectedBusiness,
    setSelectedBusinessId,
    loading: loadingBusinesses,
    isPending,
    isSuspended,
    isInactive,
  } = useProviderBusiness();

  const [dashboardData, setDashboardData] = useState(null);
  const [overviewData, setOverviewData] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [error, setError] = useState(null);

  // Load aggregate provider overview
  useEffect(() => {
    let isMounted = true;
    async function loadOverview() {
      try {
        const res = await providerApi.getProviderOverview();
        if (isMounted && res?.data) {
          setOverviewData(res.data);
        }
      } catch {
        // Non-fatal overview fetch
      }
    }
    loadOverview();
    return () => {
      isMounted = false;
    };
  }, []);

  // Load specific business dashboard
  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      if (!selectedBusinessId) {
        setLoadingDashboard(false);
        return;
      }

      try {
        setLoadingDashboard(true);
        setError(null);
        const res = await providerApi.getBusinessDashboard(selectedBusinessId);
        if (isMounted && res?.data) {
          setDashboardData(res.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load venue dashboard statistics.");
        }
      } finally {
        if (isMounted) {
          setLoadingDashboard(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [selectedBusinessId]);

  const venueName = dashboardData?.business?.name || selectedBusiness?.name || "Business Venue";

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans">
      <BusinessNav />

      <main className="flex-grow py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Multi-business switcher & status alerts */}
          <BusinessSwitcher
            businesses={businesses}
            selectedBusinessId={selectedBusinessId}
            onSelectBusiness={setSelectedBusinessId}
            selectedBusiness={selectedBusiness}
            isPending={isPending}
            isSuspended={isSuspended}
            isInactive={isInactive}
          />

          {/* Aggregated Overview Banner for multi-business providers */}
          {overviewData && overviewData.totalBusinesses > 1 && (
            <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-4 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-[#2563EB] uppercase tracking-wider text-[11px]">
                  All Venues Portfolio ({overviewData.totalBusinesses} Businesses)
                </span>
                <span className="text-slate-600">
                  Aggregated performance metrics
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-2 border-t border-blue-200">
                <div>
                  <span className="text-[#64748B] block text-[11px]">Total Today&apos;s Bookings</span>
                  <strong className="text-lg font-bold text-[#111827]">
                    {overviewData.aggregatedStats.todayBookings}
                  </strong>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[11px]">Pending Approval</span>
                  <strong className="text-lg font-bold text-[#2563EB]">
                    {overviewData.aggregatedStats.pendingBookings}
                  </strong>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[11px]">Total Active Queue</span>
                  <strong className="text-lg font-bold text-emerald-700">
                    {overviewData.aggregatedStats.totalActiveQueue}
                  </strong>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[11px]">Active Services</span>
                  <strong className="text-lg font-bold text-[#111827]">
                    {overviewData.aggregatedStats.totalActiveServices}
                  </strong>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827]">
                Business Overview
              </h1>
              <p className="mt-0.5 text-xs sm:text-sm text-[#64748B]">
                Daily operational summary for <strong>{venueName}</strong>.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to={`/business/queue?business=${selectedBusinessId}`}
                className="px-3.5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-2xs"
              >
                Open Queue Desk
              </Link>
            </div>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs">
              {error}
            </div>
          )}

          {loadingBusinesses || loadingDashboard ? (
            <div className="py-16 text-center text-xs text-[#64748B] space-y-3">
              <div className="inline-block h-8 w-8 rounded-full border-2 border-[#2563EB] border-t-transparent animate-spin" />
              <p>Loading business analytics...</p>
            </div>
          ) : !selectedBusinessId ? (
            <div className="py-16 bg-white rounded-xl border border-[#E2E8F0] text-center p-8 text-xs text-[#64748B] space-y-3">
              <p>You have not registered any business venues yet.</p>
              <Link
                to="/business/register"
                className="inline-block px-4 py-2 bg-[#2563EB] text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Register Your First Venue
              </Link>
            </div>
          ) : (
            <>
              {/* 1. Overview Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-2xs">
                  <span className="text-[11px] font-semibold text-[#64748B] block">
                    Today&apos;s Bookings
                  </span>
                  <strong className="text-2xl font-black text-[#111827] mt-1 block">
                    {dashboardData?.bookings?.todayCount ?? 0}
                  </strong>
                  <span className="text-[11px] text-[#64748B] block mt-0.5">
                    {dashboardData?.bookings?.pending ?? 0} pending confirmation
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-2xs">
                  <span className="text-[11px] font-semibold text-[#64748B] block">
                    Customers Waiting
                  </span>
                  <strong className="text-2xl font-black text-[#2563EB] mt-1 block">
                    {dashboardData?.queue?.waitingCount ?? 0}
                  </strong>
                  <span className="text-[11px] text-[#64748B] block mt-0.5">
                    {dashboardData?.queue?.totalActive ?? 0} active in line
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-2xs">
                  <span className="text-[11px] font-semibold text-[#64748B] block">
                    Currently Called / Serving
                  </span>
                  <strong className="text-2xl font-black text-emerald-700 mt-1 block truncate">
                    {dashboardData?.queue?.currentlyCalled
                      ? `#${dashboardData.queue.currentlyCalled.tokenDisplay}`
                      : "None"}
                  </strong>
                  <span className="text-[11px] text-[#64748B] block mt-0.5 truncate">
                    {dashboardData?.queue?.currentlyCalled?.customerId?.name || "Ready for next token"}
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-2xs">
                  <span className="text-[11px] font-semibold text-[#64748B] block">
                    Completed Bookings
                  </span>
                  <strong className="text-2xl font-black text-[#111827] mt-1 block">
                    {dashboardData?.bookings?.completed ?? 0}
                  </strong>
                  <span className="text-[11px] text-[#64748B] block mt-0.5">
                    {dashboardData?.bookings?.total ?? 0} total all-time
                  </span>
                </div>
              </div>

              {/* 2. Quick Actions */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Link
                  to={`/business/services?business=${selectedBusinessId}`}
                  className="p-3 bg-white rounded-xl border border-[#E2E8F0] hover:border-blue-300 shadow-2xs transition-colors text-center font-bold text-xs text-[#111827]"
                >
                  + Add Service ({dashboardData?.services?.total ?? 0})
                </Link>
                <Link
                  to={`/business/queue?business=${selectedBusinessId}`}
                  className="p-3 bg-white rounded-xl border border-[#E2E8F0] hover:border-blue-300 shadow-2xs transition-colors text-center font-bold text-xs text-[#111827]"
                >
                  View Live Queue ({dashboardData?.queue?.totalActive ?? 0})
                </Link>
                <Link
                  to={`/business/bookings?business=${selectedBusinessId}`}
                  className="p-3 bg-white rounded-xl border border-[#E2E8F0] hover:border-blue-300 shadow-2xs transition-colors text-center font-bold text-xs text-[#111827]"
                >
                  View Bookings ({dashboardData?.bookings?.pending ?? 0} pending)
                </Link>
                <Link
                  to={`/business/profile?business=${selectedBusinessId}`}
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
                        Active Desk
                      </span>
                      <h2 className="text-sm font-bold text-[#111827] mt-0.5">
                        Queue Desk Summary
                      </h2>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Live Queue Active
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg">
                      <span className="text-[10px] font-bold text-[#2563EB] uppercase block">
                        Called Token
                      </span>
                      <strong className="text-2xl font-black text-[#2563EB] mt-1 block">
                        {dashboardData?.queue?.currentlyCalled
                          ? `#${dashboardData.queue.currentlyCalled.tokenDisplay}`
                          : "None"}
                      </strong>
                    </div>

                    <div className="p-3 bg-slate-50 border border-[#E2E8F0] rounded-lg">
                      <span className="text-[10px] font-bold text-[#64748B] uppercase block">
                        Waiting in Line
                      </span>
                      <strong className="text-2xl font-black text-[#111827] mt-1 block">
                        {dashboardData?.queue?.waitingCount ?? 0}
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 border border-[#E2E8F0] rounded-lg text-xs">
                    <span className="text-[#64748B]">
                      Active Services Offered: <strong>{dashboardData?.services?.active ?? 0}</strong>
                    </span>
                    <span className="text-[#2563EB] font-bold">
                      Total Tokens in Line: {dashboardData?.queue?.totalActive ?? 0}
                    </span>
                  </div>

                  <div className="pt-1">
                    <Link
                      to={`/business/queue?business=${selectedBusinessId}`}
                      className="block w-full py-2 text-center rounded-lg bg-slate-50 hover:bg-slate-100 border border-[#E2E8F0] text-xs font-semibold text-[#111827] transition-colors"
                    >
                      Manage Live Queue Desk &rarr;
                    </Link>
                  </div>
                </div>

                {/* 4. Recent Bookings Activity */}
                <div className="lg:col-span-6 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs p-5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                    <h2 className="text-sm font-bold text-[#111827]">
                      Recent Bookings Activity
                    </h2>
                    <Link
                      to={`/business/bookings?business=${selectedBusinessId}`}
                      className="text-xs text-[#2563EB] hover:underline"
                    >
                      All Bookings
                    </Link>
                  </div>

                  {!dashboardData?.recentActivity?.bookings ||
                  dashboardData.recentActivity.bookings.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#64748B]">
                      No recent bookings recorded yet.
                    </div>
                  ) : (
                    <div className="divide-y divide-[#E2E8F0]">
                      {dashboardData.recentActivity.bookings.map((b) => {
                        const dateStr = new Date(b.bookingDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        });
                        const timeStr = new Date(b.bookingDate).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        });
                        const custName = b.customerId?.name || "Customer";
                        const svcName = b.serviceSnapshot?.name || "Service";

                        return (
                          <div
                            key={b._id}
                            className="py-2.5 first:pt-1 last:pb-1 flex items-center justify-between text-xs"
                          >
                            <div>
                              <strong className="text-[#111827] block">{custName}</strong>
                              <span className="text-[#64748B] text-xs block mt-0.5">
                                {svcName} • {dateStr} at {timeStr}
                              </span>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-semibold capitalize ${
                                b.status === "confirmed"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : b.status === "pending"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-slate-100 text-[#64748B] border border-slate-200"
                              }`}
                            >
                              {b.status}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
