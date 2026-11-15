import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router";
import UserNav from "../components/UserNav";
import { queueApi, businessApi } from "../../../api/auth";

const gracePeriodStages = [
  { name: "Token Called", desc: "Counter announces your token", status: "upcoming" },
  { name: "Grace Period", desc: "10-minute arrival window active", status: "upcoming" },
  { name: "Waiting", desc: "Staff holds your spot at station", status: "upcoming" },
  { name: "Skipped", desc: "Token released if absent after grace period", status: "pending" },
];

function Queue() {
  const [searchParams] = useSearchParams();
  const businessIdFromUrl = searchParams.get("business");

  // Active Queue State
  const [activeEntry, setActiveEntry] = useState(null);
  const [loadingActive, setLoadingActive] = useState(true);
  const [leaving, setLeaving] = useState(false);

  // Join Queue Form State (when no active queue)
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState(businessIdFromUrl || "");
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [notes, setNotes] = useState("");
  const [loadingServices, setLoadingServices] = useState(false);
  const [joining, setJoining] = useState(false);

  // Status Alerts
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Initial load & 10-second polling for active queue entries
  useEffect(() => {
    let isMounted = true;

    async function checkActiveQueue() {
      try {
        const res = await queueApi.getMyEntries();
        if (isMounted && res?.data) {
          const entries = Array.isArray(res.data) ? res.data : [];
          setActiveEntry(entries.length > 0 ? entries[0] : null);
        }
      } catch {
        // Polling errors shouldn't crash UI
      } finally {
        if (isMounted) {
          setLoadingActive(false);
        }
      }
    }

    checkActiveQueue();

    const interval = setInterval(() => {
      checkActiveQueue();
    }, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Load venues if user has no active queue
  useEffect(() => {
    if (!activeEntry) {
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
          // ignore
        }
      }
      loadVenues();
    }
  }, [activeEntry, selectedBusinessId]);

  // Load services for selected venue when user has no active entry
  useEffect(() => {
    let isMounted = true;

    async function loadVenueData() {
      if (activeEntry || !selectedBusinessId) return;
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
          setErrorMessage(err.message || "Failed to load venue details.");
        }
      } finally {
        if (isMounted) {
          setLoadingServices(false);
        }
      }
    }

    loadVenueData();

    return () => {
      isMounted = false;
    };
  }, [activeEntry, selectedBusinessId]);

  // Join Walk-in Queue Handler
  const handleJoinQueue = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!selectedBusinessId) {
      setErrorMessage("Please select a business venue to join its queue.");
      return;
    }

    try {
      setJoining(true);
      const payload = {
        businessId: selectedBusinessId,
        serviceId: selectedServiceId || undefined,
        notes: notes.trim() || undefined,
      };

      const res = await queueApi.join(payload);
      if (res?.data) {
        setActiveEntry(res.data);
        setSuccessMessage("Joined the queue successfully! Your live token has been generated.");
      }
    } catch (err) {
      const msg = err.message || "";
      if (msg.includes("QUEUE_CAPACITY_EXCEEDED") || msg.toLowerCase().includes("maximum capacity")) {
        setErrorMessage("The walk-in queue for this venue is currently at full capacity. Please try again later or book a slot.");
      } else if (msg.includes("DUPLICATE_QUEUE_ENTRY") || msg.toLowerCase().includes("already have an active")) {
        setErrorMessage("You already hold an active queue token for this business venue.");
      } else {
        setErrorMessage(msg || "Failed to join walk-in queue.");
      }
    } finally {
      setJoining(false);
    }
  };

  // Leave / Cancel Queue Handler
  const handleLeaveQueue = async () => {
    if (!activeEntry) return;

    if (!window.confirm("Are you sure you want to release your queue token? You will lose your current spot in line.")) {
      return;
    }

    try {
      setLeaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      await queueApi.leave(activeEntry._id, "Customer voluntarily left queue via portal");
      setActiveEntry(null);
      setSuccessMessage("You have successfully left the queue and released your token.");
    } catch (err) {
      setErrorMessage(err.message || "Failed to leave queue. Please try again.");
    } finally {
      setLeaving(false);
    }
  };

  if (loadingActive) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans">
        <UserNav />
        <main className="flex-grow py-16 flex items-center justify-center">
          <div className="text-center text-xs text-[#64748B] space-y-3">
            <div className="inline-block h-8 w-8 rounded-full border-2 border-[#2563EB] border-t-transparent animate-spin" />
            <p>Loading queue status...</p>
          </div>
        </main>
      </div>
    );
  }

  // ACTIVE QUEUE VIEW
  if (activeEntry) {
    const businessName = activeEntry.businessId?.name || "Business Venue";
    const serviceName = activeEntry.serviceSnapshot?.name || "Walk-in Service";
    const serviceDuration = activeEntry.serviceSnapshot?.duration
      ? `${activeEntry.serviceSnapshot.duration} min`
      : "15 min";
    const peopleAhead = Math.max(0, (activeEntry.position || 1) - 1);
    const estimatedWaitMins = Math.max(1, peopleAhead) * (activeEntry.serviceSnapshot?.duration || 15);
    const isCalled = activeEntry.status === "called";
    const isServing = activeEntry.status === "serving";

    return (
      <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans">
        <UserNav />

        <main className="flex-grow py-8">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                  Live Queue Tracker • Auto-refreshing
                </span>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827]">
                  {businessName}
                </h1>
                <p className="text-xs text-[#64748B] mt-0.5">
                  {serviceName}
                </p>
              </div>

              <div>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                    isCalled
                      ? "bg-amber-100 text-amber-800 border-amber-300 animate-pulse"
                      : isServing
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                      : "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isCalled ? "bg-amber-600" : isServing ? "bg-emerald-600" : "bg-[#2563EB]"
                    }`}
                  />
                  Status: {isCalled ? "Token Called!" : isServing ? "Serving Now" : "Waiting in Line"}
                </span>
              </div>
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

            {/* High Visual Hierarchy: Token Status Block */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* YOUR TOKEN */}
              <div className="bg-[#EFF6FF] border-2 border-[#2563EB] rounded-xl p-4 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] block">
                  Your Token
                </span>
                <strong className="text-3xl sm:text-4xl font-black text-[#2563EB] mt-1 block">
                  #{activeEntry.tokenDisplay}
                </strong>
                <span className="text-xs font-medium text-[#2563EB]">Assigned</span>
              </div>

              {/* CURRENT TOKEN */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] block">
                  Your Position
                </span>
                <strong className="text-3xl sm:text-4xl font-black text-[#111827] mt-1 block">
                  #{activeEntry.position || 1}
                </strong>
                <span className="text-xs text-[#64748B]">In queue line</span>
              </div>

              {/* PEOPLE AHEAD */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] block">
                  People Ahead
                </span>
                <strong className="text-3xl sm:text-4xl font-black text-[#111827] mt-1 block">
                  {peopleAhead}
                </strong>
                <span className="text-xs text-[#64748B]">Waiting</span>
              </div>

              {/* ESTIMATED WAITING TIME */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] block">
                  Estimated Wait
                </span>
                <strong className="text-2xl sm:text-3xl font-black text-[#0891B2] mt-2 block">
                  ~{estimatedWaitMins} mins
                </strong>
                <span className="text-xs text-[#64748B]">Approximate</span>
              </div>
            </div>

            {/* Selected Services & Duration */}
            <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-2xs space-y-3">
              <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                Selected Service &amp; Details
              </h2>

              <div className="divide-y divide-[#E2E8F0] text-xs">
                <div className="py-2.5 first:pt-1 last:pb-1 flex items-center justify-between">
                  <span className="font-semibold text-[#111827]">{serviceName}</span>
                  <span className="text-[#64748B]">Est. {serviceDuration}</span>
                </div>
                {activeEntry.serviceSnapshot?.price && (
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-[#64748B]">Service Price</span>
                    <strong className="text-[#111827]">₹{activeEntry.serviceSnapshot.price}</strong>
                  </div>
                )}
                {activeEntry.notes && (
                  <div className="py-2.5 text-slate-500 italic">
                    Notes: {activeEntry.notes}
                  </div>
                )}
              </div>
            </div>

            {/* Grace Period Policy Visualization */}
            <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                  No-Show Grace Period Protocol
                </h2>
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  10-Minute Policy
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-1">
                {gracePeriodStages.map((stage, idx) => (
                  <div
                    key={stage.name}
                    className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs"
                  >
                    <span className="text-xs font-bold text-[#3730A3] block">
                      Phase {idx + 1}
                    </span>
                    <strong className="text-xs font-bold text-[#111827] mt-0.5 block">
                      {stage.name}
                    </strong>
                    <span className="text-xs text-[#64748B] mt-1 block leading-normal">
                      {stage.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Control: Cancel Queue Token */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleLeaveQueue}
                disabled={leaving}
                className="min-h-[44px] px-5 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 font-semibold rounded-lg text-xs transition-colors inline-flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
              >
                {leaving ? "Releasing Token..." : "Cancel Queue Token"}
              </button>
              <p className="text-xs text-[#64748B] mt-1.5">
                Releases your token so next in line can be served.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // NO ACTIVE QUEUE -> JOIN QUEUE FORM
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans">
      <UserNav />

      <main className="flex-grow py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
              Walk-in Queues
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827] mt-0.5">
              Join a Live Walk-in Queue
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              Take a digital queue token to hold your spot without waiting in person.
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

          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs p-6 space-y-6">
            <form onSubmit={handleJoinQueue} className="space-y-4">
              {/* Venue Selector */}
              <div>
                <label
                  htmlFor="queue-venue"
                  className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5"
                >
                  Select Business Venue
                </label>
                <select
                  id="queue-venue"
                  value={selectedBusinessId}
                  onChange={(e) => setSelectedBusinessId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs text-[#111827] focus:outline-none focus:border-[#2563EB]"
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

              {/* Service Selection */}
              <div>
                <label
                  htmlFor="queue-service"
                  className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5"
                >
                  Select Service (Optional)
                </label>
                {loadingServices ? (
                  <div className="p-2 text-xs text-[#64748B]">Loading services...</div>
                ) : (
                  <select
                    id="queue-service"
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs text-[#111827] focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="">General Walk-in Visit</option>
                    {services.map((svc) => (
                      <option key={svc._id} value={svc._id}>
                        {svc.name} (~{svc.duration} min • ₹{svc.price})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Notes */}
              <div>
                <label
                  htmlFor="queue-notes"
                  className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5"
                >
                  Visit Notes (Optional)
                </label>
                <input
                  id="queue-notes"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Any special requests or requirements"
                  maxLength={500}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-xs text-[#111827] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Venue Info Card */}
              {selectedBusiness && (
                <div className="p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-xs space-y-1">
                  <span className="font-bold text-[#111827] block">{selectedBusiness.name}</span>
                  <span className="text-[#64748B] block">
                    {selectedBusiness.address?.street}, {selectedBusiness.address?.city}
                  </span>
                  <span className="text-emerald-700 font-semibold block pt-1">
                    ✓ Live walk-in queue active
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={joining || !selectedBusinessId}
                className="w-full min-h-[44px] flex items-center justify-center py-2.5 px-4 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg text-xs transition-colors shadow-2xs cursor-pointer disabled:cursor-not-allowed"
              >
                {joining ? "Generating Token..." : "Join Queue Now"}
              </button>
            </form>

            <div className="pt-4 border-t border-[#E2E8F0] text-center text-xs text-[#64748B]">
              <span>Looking for other venues? </span>
              <Link to="/discover" className="text-[#2563EB] hover:underline font-semibold">
                Explore Discover Page
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Queue;
