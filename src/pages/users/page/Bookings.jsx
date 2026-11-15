import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router";
import UserNav from "../components/UserNav";
import { bookingApi, businessApi } from "../../../api/auth";

const TIME_SLOTS = [
  "09:30 AM",
  "10:30 AM",
  "11:15 AM",
  "02:00 PM",
  "03:30 PM",
  "04:45 PM",
];

// Helper to convert 12-hour time ("10:30 AM") to 24-hour "HH:MM"
function convertTo24Hour(time12h) {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":");
  if (hours === "12") {
    hours = "00";
  }
  if (modifier === "PM") {
    hours = parseInt(hours, 10) + 12;
  }
  return `${String(hours).padStart(2, "0")}:${minutes}`;
}

function Bookings() {
  const [searchParams] = useSearchParams();
  const businessIdFromUrl = searchParams.get("business");

  // Venue & Services State
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState(businessIdFromUrl || "");
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [notes, setNotes] = useState("");

  // Date & Time State
  const todayStr = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[1]);

  // Bookings List State
  const [myBookings, setMyBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingServices, setLoadingServices] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // User Feedback
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const refreshMyBookings = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  // Fetch customer's own bookings
  useEffect(() => {
    let isMounted = true;

    async function loadBookings() {
      try {
        const res = await bookingApi.getMyBookings();
        if (isMounted && res?.data) {
          setMyBookings(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err) {
        if (isMounted) {
          setErrorMessage(err.message || "Failed to load your bookings.");
        }
      } finally {
        if (isMounted) {
          setLoadingBookings(false);
        }
      }
    }

    loadBookings();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  // Load available venues list
  useEffect(() => {
    async function loadVenues() {
      try {
        const res = await businessApi.getPublicBusinesses({ limit: 20 });
        if (res?.data?.businesses) {
          setBusinesses(res.data.businesses);
          if (!selectedBusinessId && res.data.businesses.length > 0) {
            setSelectedBusinessId(res.data.businesses[0]._id);
          }
        }
      } catch {
        // Non-fatal, user can still book if businessIdFromUrl is supplied
      }
    }
    loadVenues();
  }, [selectedBusinessId]);

  // Load active services for the selected business
  useEffect(() => {
    let isMounted = true;

    async function loadServices() {
      if (!selectedBusinessId) return;
      try {
        setLoadingServices(true);
        const [profileRes, servicesRes] = await Promise.all([
          businessApi.getPublicProfile(selectedBusinessId),
          businessApi.getPublicServices(selectedBusinessId),
        ]);

        if (isMounted) {
          setSelectedBusiness(profileRes?.data?.business || null);
          const activeSvcs = servicesRes?.data?.services || [];
          setServices(activeSvcs);
          if (activeSvcs.length > 0) {
            setSelectedServiceId(activeSvcs[0]._id);
          } else {
            setSelectedServiceId("");
          }
        }
      } catch (err) {
        if (isMounted) {
          setErrorMessage(err.message || "Failed to load venue services.");
        }
      } finally {
        if (isMounted) {
          setLoadingServices(false);
        }
      }
    }

    loadServices();

    return () => {
      isMounted = false;
    };
  }, [selectedBusinessId]);

  // Handle Booking Creation
  const handleCreateBooking = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!selectedBusinessId) {
      setErrorMessage("Please select a business venue.");
      return;
    }

    if (!selectedServiceId) {
      setErrorMessage("Please select an active service to book.");
      return;
    }

    if (!selectedDate) {
      setErrorMessage("Please select a preferred date.");
      return;
    }

    // Build ISO 8601 datetime string in future
    const time24 = convertTo24Hour(selectedSlot);
    const combinedDateTime = new Date(`${selectedDate}T${time24}:00`);

    if (isNaN(combinedDateTime.getTime())) {
      setErrorMessage("Invalid date or time slot selected.");
      return;
    }

    if (combinedDateTime.getTime() <= Date.now() - 60000) {
      setErrorMessage("Please choose a future date and time slot.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        businessId: selectedBusinessId,
        serviceId: selectedServiceId,
        bookingDate: combinedDateTime.toISOString(),
        notes: notes.trim() || undefined,
      };

      await bookingApi.create(payload);
      setSuccessMessage("Appointment booked successfully!");
      setNotes("");
      refreshMyBookings();
    } catch (err) {
      setErrorMessage(err.message || "Failed to book appointment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Booking Cancellation
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      setCancellingId(bookingId);
      setErrorMessage("");
      setSuccessMessage("");

      await bookingApi.cancel(bookingId, "Customer requested cancellation via portal");
      setSuccessMessage("Booking cancelled successfully.");
      refreshMyBookings();
    } catch (err) {
      setErrorMessage(err.message || "Failed to cancel booking. It may no longer be eligible.");
    } finally {
      setCancellingId(null);
    }
  };

  const selectedService = services.find((s) => s._id === selectedServiceId);
  const upcomingBookings = myBookings.filter(
    (b) => b.status === "pending" || b.status === "confirmed"
  );
  const pastBookings = myBookings.filter(
    (b) => b.status !== "pending" && b.status !== "confirmed"
  );

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

          {/* Core Booking Interface: Service Selection + Slot + Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Service Selection & Available Slots */}
            <div className="lg:col-span-7 space-y-6">
              {/* Venue Selector */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs p-5 space-y-3">
                <label
                  htmlFor="venue-picker"
                  className="block text-xs font-bold uppercase tracking-wider text-[#64748B]"
                >
                  Select Business Venue
                </label>
                <select
                  id="venue-picker"
                  value={selectedBusinessId}
                  onChange={(e) => setSelectedBusinessId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs text-[#111827] focus:outline-none focus:border-[#2563EB]"
                >
                  {selectedBusiness && !businesses.some((b) => b._id === selectedBusiness._id) && (
                    <option value={selectedBusiness._id}>{selectedBusiness.name}</option>
                  )}
                  {businesses.map((biz) => (
                    <option key={biz._id} value={biz._id}>
                      {biz.name} ({biz.address?.city || "Local"})
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 1: Service Selection UI */}
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
                    Venue: <strong>{selectedBusiness?.name || "Selected Venue"}</strong>
                  </span>
                </div>

                {loadingServices ? (
                  <div className="py-8 text-center text-xs text-[#64748B]">
                    Loading active services...
                  </div>
                ) : services.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#64748B]">
                    No active services listed for this venue. Please select another business.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {services.map((svc) => {
                      const isSelected = selectedServiceId === svc._id;
                      return (
                        <div
                          key={svc._id}
                          onClick={() => setSelectedServiceId(svc._id)}
                          className={`p-3.5 rounded-lg border transition-colors flex items-start justify-between gap-3 cursor-pointer ${
                            isSelected
                              ? "border-[#2563EB] bg-[#EFF6FF]/40"
                              : "border-[#E2E8F0] hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              name="serviceSelection"
                              checked={isSelected}
                              onChange={() => setSelectedServiceId(svc._id)}
                              className="mt-0.5 h-4 w-4 border-[#E2E8F0] text-[#2563EB] focus:ring-[#2563EB]"
                            />
                            <div>
                              <strong className="text-xs sm:text-sm text-[#111827] block">
                                {svc.name}
                              </strong>
                              {svc.description && (
                                <span className="text-[11px] text-[#64748B] block mt-0.5">
                                  {svc.description}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <strong className="text-xs sm:text-sm text-[#111827] block">
                              ₹{svc.price}
                            </strong>
                            <span className="text-[11px] text-[#2563EB] font-medium block">
                              ~{svc.duration} min
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Step 2: Available Slot Picker UI */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#3730A3]">
                      Step 2
                    </span>
                    <h2 className="text-sm sm:text-base font-bold text-[#111827]">
                      Date &amp; Time Slot
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="booking-date"
                      className="block text-xs font-semibold text-[#111827] mb-1"
                    >
                      Preferred Date
                    </label>
                    <input
                      id="booking-date"
                      type="date"
                      min={todayStr}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-xs text-[#111827] focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <span className="block text-xs font-semibold text-[#111827] mb-1">
                      Available Time Slots
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2 px-1 text-center rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                            selectedSlot === slot
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

                <div>
                  <label
                    htmlFor="booking-notes"
                    className="block text-xs font-semibold text-[#111827] mb-1"
                  >
                    Special Requests or Notes (Optional)
                  </label>
                  <input
                    id="booking-notes"
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Any preferences or special instructions"
                    maxLength={500}
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-xs text-[#111827] focus:outline-none focus:border-[#2563EB]"
                  />
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
                    <strong className="text-[#111827]">
                      {selectedBusiness?.name || "None selected"}
                    </strong>
                  </div>

                  <div className="py-1 border-b border-[#E2E8F0]">
                    <span className="text-[#64748B] block mb-1">Selected Service:</span>
                    {selectedService ? (
                      <div className="flex justify-between text-[#111827]">
                        <span>• {selectedService.name}</span>
                        <span>₹{selectedService.price}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">No service chosen</span>
                    )}
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                    <span className="text-[#64748B]">Estimated Duration</span>
                    <strong className="text-[#2563EB]">
                      {selectedService ? `~${selectedService.duration} mins` : "—"}
                    </strong>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                    <span className="text-[#64748B]">Date &amp; Slot</span>
                    <strong className="text-[#111827]">
                      {selectedDate} at {selectedSlot}
                    </strong>
                  </div>

                  <div className="flex justify-between py-2 text-sm font-extrabold text-[#111827]">
                    <span>Total Amount</span>
                    <span>₹{selectedService?.price || 0}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCreateBooking}
                  disabled={submitting || !selectedServiceId}
                  className="w-full min-h-[44px] flex items-center justify-center py-2.5 px-4 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg text-xs transition-colors shadow-2xs cursor-pointer disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin mr-2" />
                      <span>Confirming Slot...</span>
                    </>
                  ) : (
                    "Confirm Booking Slot"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Confirmed & Past Bookings Section */}
          <div className="space-y-4 pt-4 border-t border-[#E2E8F0]">
            <h2 className="text-base font-bold text-[#111827]">
              My Scheduled Appointments
            </h2>

            {loadingBookings ? (
              <div className="py-6 text-center text-xs text-[#64748B]">
                Loading your appointments...
              </div>
            ) : upcomingBookings.length === 0 ? (
              <div className="p-6 bg-white rounded-xl border border-[#E2E8F0] text-center text-xs text-[#64748B]">
                You have no upcoming appointments scheduled.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingBookings.map((b) => {
                  const bDate = new Date(b.bookingDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                  const bTime = new Date(b.bookingDate).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const bizName = b.businessId?.name || "Business Venue";
                  const svcName = b.serviceSnapshot?.name || "Service";
                  const duration = b.serviceSnapshot?.duration
                    ? `${b.serviceSnapshot.duration} min`
                    : "Standard";

                  return (
                    <div
                      key={b._id}
                      className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-2xs flex items-start justify-between text-xs"
                    >
                      <div className="space-y-1">
                        <strong className="text-sm text-[#111827] block">{bizName}</strong>
                        <span className="text-[#64748B] block">
                          {svcName} • {duration}
                        </span>
                        <span className="text-[#111827] font-semibold block">
                          {bDate} • {bTime}
                        </span>
                        {b.notes && (
                          <span className="text-[11px] text-slate-500 block italic">
                            Note: {b.notes}
                          </span>
                        )}
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => handleCancelBooking(b._id)}
                            disabled={cancellingId === b._id}
                            className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer underline disabled:opacity-50"
                          >
                            {cancellingId === b._id ? "Cancelling..." : "Cancel Booking"}
                          </button>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-semibold capitalize ${
                          b.status === "confirmed"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]"
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider pt-4">
              Past Appointments &amp; History
            </h3>
            {pastBookings.length === 0 ? (
              <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] text-center text-xs text-[#64748B]">
                No past appointments found.
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs divide-y divide-[#E2E8F0]">
                {pastBookings.map((pb) => {
                  const pbDate = new Date(pb.bookingDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                  const bizName = pb.businessId?.name || "Business Venue";
                  const svcName = pb.serviceSnapshot?.name || "Service";

                  return (
                    <div
                      key={pb._id}
                      className="p-3.5 flex items-center justify-between text-xs"
                    >
                      <div>
                        <strong className="text-[#111827]">{bizName}</strong>
                        <span className="text-[#64748B] ml-2">
                          {svcName} • {pbDate}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-semibold capitalize ${
                          pb.status === "completed"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : pb.status === "cancelled"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {pb.status}
                      </span>
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

export default Bookings;
