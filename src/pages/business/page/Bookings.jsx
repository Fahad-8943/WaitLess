import { useState, useEffect, useCallback } from "react";
import BusinessNav from "../components/BusinessNav";
import BusinessSwitcher from "../components/BusinessSwitcher";
import { useProviderBusiness } from "../hooks/useProviderBusiness";
import { providerApi } from "../../../api/auth";

const STATUS_FILTERS = [
  { label: "All Statuses", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Rejected", value: "rejected" },
];

function Bookings() {
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

  const [bookings, setBookings] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [actionInProgressId, setActionInProgressId] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const triggerReload = useCallback(() => {
    setReloadTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function fetchBookings() {
      if (!selectedBusinessId) {
        setLoadingBookings(false);
        return;
      }

      try {
        setErrorMessage("");
        const params = {
          page: pagination.page,
          limit: 20,
        };
        if (statusFilter && statusFilter !== "all") {
          params.status = statusFilter;
        }
        if (dateFilter) {
          params.date = dateFilter;
        }

        const res = await providerApi.getBookings(selectedBusinessId, params);
        if (isMounted && res?.data) {
          setBookings(Array.isArray(res.data) ? res.data : []);
          if (res.meta) {
            setPagination(res.meta);
          }
        }
      } catch (err) {
        if (isMounted) {
          setErrorMessage(err.message || "Failed to load bookings schedule.");
        }
      } finally {
        if (isMounted) {
          setLoadingBookings(false);
        }
      }
    }

    fetchBookings();

    return () => {
      isMounted = false;
    };
  }, [selectedBusinessId, statusFilter, dateFilter, pagination.page, reloadTrigger]);

  // Status Action Handlers
  const handleConfirm = async (bookingId) => {
    try {
      setActionInProgressId(bookingId);
      setErrorMessage("");
      setSuccessMessage("");
      await providerApi.confirmBooking(selectedBusinessId, bookingId);
      setSuccessMessage("Booking confirmed successfully.");
      triggerReload();
    } catch (err) {
      setErrorMessage(err.message || "Failed to confirm booking.");
    } finally {
      setActionInProgressId(null);
    }
  };

  const handleReject = async (bookingId) => {
    const reason = window.prompt("Reason for rejecting this appointment (optional):", "");
    if (reason === null) return; // cancelled prompt

    try {
      setActionInProgressId(bookingId);
      setErrorMessage("");
      setSuccessMessage("");
      await providerApi.rejectBooking(selectedBusinessId, bookingId, reason.trim());
      setSuccessMessage("Booking rejected.");
      triggerReload();
    } catch (err) {
      setErrorMessage(err.message || "Failed to reject booking.");
    } finally {
      setActionInProgressId(null);
    }
  };

  const handleComplete = async (bookingId) => {
    try {
      setActionInProgressId(bookingId);
      setErrorMessage("");
      setSuccessMessage("");
      await providerApi.completeBooking(selectedBusinessId, bookingId);
      setSuccessMessage("Appointment marked as completed.");
      triggerReload();
    } catch (err) {
      setErrorMessage(err.message || "Failed to complete booking.");
    } finally {
      setActionInProgressId(null);
    }
  };

  const handleCancel = async (bookingId) => {
    const reason = window.prompt("Reason for cancelling this appointment (optional):", "");
    if (reason === null) return;

    try {
      setActionInProgressId(bookingId);
      setErrorMessage("");
      setSuccessMessage("");
      await providerApi.cancelBooking(selectedBusinessId, bookingId, reason.trim());
      setSuccessMessage("Booking cancelled.");
      triggerReload();
    } catch (err) {
      setErrorMessage(err.message || "Failed to cancel booking.");
    } finally {
      setActionInProgressId(null);
    }
  };

  const venueName = selectedBusiness?.name || "Selected Venue";

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

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827]">
                Bookings Schedule
              </h1>
              <p className="mt-0.5 text-xs sm:text-sm text-[#64748B]">
                View, confirm, and manage customer appointments for <strong>{venueName}</strong>.
              </p>
            </div>
            <span className="text-xs text-[#64748B]">
              Total Schedule: <strong>{pagination.total ?? bookings.length}</strong> bookings
            </span>
          </div>

          {successMessage && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center justify-between">
              <span>{successMessage}</span>
              <button
                type="button"
                onClick={() => setSuccessMessage("")}
                className="text-emerald-700 hover:text-emerald-900 font-bold ml-2"
              >
                ✕
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center justify-between">
              <span>{errorMessage}</span>
              <button
                type="button"
                onClick={() => setErrorMessage("")}
                className="text-rose-700 hover:text-rose-900 font-bold ml-2"
              >
                ✕
              </button>
            </div>
          )}

          {/* Filter Bar */}
          <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-[#64748B] uppercase text-[11px]">
                Filter Status:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {STATUS_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setStatusFilter(f.value)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                      statusFilter === f.value
                        ? "bg-[#2563EB] text-white border-[#2563EB]"
                        : "bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:bg-slate-100"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="filter-date" className="font-semibold text-[#64748B] text-[11px] uppercase">
                Date:
              </label>
              <input
                id="filter-date"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-2.5 py-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs text-[#111827] focus:outline-none focus:border-[#2563EB]"
              />
              {dateFilter && (
                <button
                  type="button"
                  onClick={() => setDateFilter("")}
                  className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer underline"
                >
                  Clear Date
                </button>
              )}
            </div>
          </div>

          {/* Bookings Table / Cards */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
            {loadingBusinesses || loadingBookings ? (
              <div className="py-16 text-center text-xs text-[#64748B] space-y-3">
                <div className="inline-block h-8 w-8 rounded-full border-2 border-[#2563EB] border-t-transparent animate-spin" />
                <p>Loading bookings schedule...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="py-16 text-center text-xs text-[#64748B] space-y-2">
                <p>No customer appointments found matching the selected filter criteria.</p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Service</th>
                        <th className="py-3 px-4">Appointment Date &amp; Time</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Notes</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {bookings.map((b) => {
                        const bDate = new Date(b.bookingDate).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        });
                        const bTime = new Date(b.bookingDate).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        });
                        const custName = b.customerId?.name || "Customer";
                        const custContact = b.customerId?.phone || b.customerId?.email || "—";
                        const svcName = b.serviceSnapshot?.name || "Service";
                        const svcDuration = b.serviceSnapshot?.duration ? `${b.serviceSnapshot.duration}m` : "";
                        const svcPrice = b.serviceSnapshot?.price ? `₹${b.serviceSnapshot.price}` : "";
                        const isActionBusy = actionInProgressId === b._id;

                        return (
                          <tr key={b._id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-3.5 px-4">
                              <strong className="text-[#111827] block">{custName}</strong>
                              <span className="text-[11px] text-[#64748B] block mt-0.5">{custContact}</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-semibold text-[#111827] block">{svcName}</span>
                              <span className="text-[11px] text-[#2563EB] block mt-0.5">
                                {svcDuration} {svcPrice && `• ${svcPrice}`}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="text-[#111827] font-medium block">{bDate}</span>
                              <strong className="text-[#2563EB] block mt-0.5">{bTime}</strong>
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-semibold capitalize border ${
                                  b.status === "confirmed"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : b.status === "pending"
                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                    : b.status === "completed"
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : "bg-slate-100 text-slate-600 border-slate-200"
                                }`}
                              >
                                {b.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-[#64748B] max-w-xs truncate">
                              {b.notes || b.cancellationReason || "—"}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              {b.status === "pending" && (
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleConfirm(b._id)}
                                    disabled={isActionBusy}
                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-2xs cursor-pointer disabled:opacity-50"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleReject(b._id)}
                                    disabled={isActionBusy}
                                    className="px-2.5 py-1 bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 rounded text-xs font-semibold cursor-pointer disabled:opacity-50"
                                  >
                                    Reject
                                  </button>
                                </div>
                              )}

                              {b.status === "confirmed" && (
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleComplete(b._id)}
                                    disabled={isActionBusy}
                                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold shadow-2xs cursor-pointer disabled:opacity-50"
                                  >
                                    Complete
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleCancel(b._id)}
                                    disabled={isActionBusy}
                                    className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded text-xs font-semibold cursor-pointer disabled:opacity-50"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              )}

                              {["completed", "cancelled", "rejected"].includes(b.status) && (
                                <span className="text-[11px] text-slate-400 italic">No actions</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards View */}
                <div className="lg:hidden divide-y divide-[#E2E8F0]">
                  {bookings.map((b) => {
                    const bDate = new Date(b.bookingDate).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    });
                    const bTime = new Date(b.bookingDate).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    const custName = b.customerId?.name || "Customer";
                    const custContact = b.customerId?.phone || b.customerId?.email || "—";
                    const svcName = b.serviceSnapshot?.name || "Service";
                    const isActionBusy = actionInProgressId === b._id;

                    return (
                      <div key={b._id} className="p-4 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <strong className="text-sm font-bold text-[#111827]">{custName}</strong>
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold capitalize border ${
                              b.status === "confirmed"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : b.status === "pending"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : b.status === "completed"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>
                        <p className="text-[#64748B]">Contact: {custContact}</p>
                        <p className="text-[#111827]">
                          Service: <strong>{svcName}</strong>
                        </p>
                        <div className="flex items-center justify-between text-[#111827]">
                          <span>{bDate}</span>
                          <strong className="text-[#2563EB]">{bTime}</strong>
                        </div>
                        {b.notes && <p className="text-[11px] text-slate-500 italic">Notes: {b.notes}</p>}

                        {/* Actions in mobile card */}
                        {b.status === "pending" && (
                          <div className="flex items-center gap-2 pt-2 border-t border-[#E2E8F0]">
                            <button
                              type="button"
                              onClick={() => handleConfirm(b._id)}
                              disabled={isActionBusy}
                              className="flex-1 py-1.5 bg-emerald-600 text-white rounded text-xs font-semibold text-center"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(b._id)}
                              disabled={isActionBusy}
                              className="flex-1 py-1.5 border border-rose-200 text-rose-600 rounded text-xs font-semibold text-center"
                            >
                              Reject
                            </button>
                          </div>
                        )}

                        {b.status === "confirmed" && (
                          <div className="flex items-center gap-2 pt-2 border-t border-[#E2E8F0]">
                            <button
                              type="button"
                              onClick={() => handleComplete(b._id)}
                              disabled={isActionBusy}
                              className="flex-1 py-1.5 bg-blue-600 text-white rounded text-xs font-semibold text-center"
                            >
                              Mark Completed
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCancel(b._id)}
                              disabled={isActionBusy}
                              className="flex-1 py-1.5 border border-slate-200 text-slate-700 rounded text-xs font-semibold text-center"
                            >
                              Cancel Booking
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Bookings;
