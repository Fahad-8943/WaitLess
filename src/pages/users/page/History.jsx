import { useState, useEffect } from "react";
import UserNav from "../components/UserNav";
import { bookingApi } from "../../../api/auth";

function History() {
  const [completedServices, setCompletedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchHistory() {
      try {
        setLoading(true);
        const res = await bookingApi.getMyBookings();
        if (isMounted && res?.data) {
          const list = Array.isArray(res.data) ? res.data : [];
          // Include completed, cancelled, rejected, or bookings with past date
          const historical = list.filter(
            (b) =>
              b.status === "completed" ||
              b.status === "cancelled" ||
              b.status === "rejected" ||
              b.status === "no_show" ||
              new Date(b.bookingDate).getTime() < Date.now()
          );
          setCompletedServices(historical);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load service history.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchHistory();

    return () => {
      isMounted = false;
    };
  }, []);

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

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs">
              {error}
            </div>
          )}

          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between text-xs">
              <span className="font-semibold text-[#111827]">
                Total Historical Visits: {completedServices.length}
              </span>
              <span className="text-[#64748B]">Sorted by most recent</span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-[#64748B] space-y-2">
                <div className="inline-block h-6 w-6 rounded-full border-2 border-[#2563EB] border-t-transparent animate-spin" />
                <p>Loading service history...</p>
              </div>
            ) : completedServices.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#64748B]">
                No completed service history recorded yet.
              </div>
            ) : (
              <div className="divide-y divide-[#E2E8F0]">
                {completedServices.map((item) => {
                  const bDate = new Date(item.bookingDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                  const bTime = new Date(item.bookingDate).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const bizName = item.businessId?.name || "Business Venue";
                  const svcName = item.serviceSnapshot?.name || "Service";
                  const duration = item.serviceSnapshot?.duration
                    ? `${item.serviceSnapshot.duration} min`
                    : "Standard";
                  const price = item.serviceSnapshot?.price
                    ? `₹${item.serviceSnapshot.price}`
                    : "—";

                  return (
                    <div
                      key={item._id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <strong className="text-sm font-bold text-[#111827] block">
                          {bizName}
                        </strong>
                        <p className="text-[#64748B]">
                          {svcName} • Duration: {duration}
                        </p>
                        <div className="text-xs text-[#64748B]">
                          {bDate} at {bTime}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 sm:text-right">
                        <strong className="text-sm text-[#111827]">
                          {price}
                        </strong>
                        <span
                          className={`px-2.5 py-0.5 rounded text-xs font-semibold capitalize ${
                            item.status === "completed"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : item.status === "cancelled"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default History;
