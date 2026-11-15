import { useState, useEffect, useCallback } from "react";
import BusinessNav from "../components/BusinessNav";
import BusinessSwitcher from "../components/BusinessSwitcher";
import { useProviderBusiness } from "../hooks/useProviderBusiness";
import { providerApi } from "../../../api/auth";

const gracePeriodStages = [
  { label: "Customer Called", desc: "Token announced to station", status: "completed" },
  { label: "Grace Period (10m)", desc: "Customer transit window", status: "active" },
  { label: "Waiting at Station", desc: "Staff preparing seat", status: "pending" },
  { label: "Skipped / Released", desc: "Released if absent", status: "pending" },
];

function Queue() {
  const {
    businesses,
    selectedBusinessId,
    selectedBusiness,
    setSelectedBusinessId,
    isPending,
    isSuspended,
    isInactive,
  } = useProviderBusiness();

  const [queueEntries, setQueueEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [loadingQueue, setLoadingQueue] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const triggerReload = useCallback(() => {
    setReloadTrigger((prev) => prev + 1);
  }, []);

  // Data fetching and periodic polling (10s interval)
  useEffect(() => {
    let isMounted = true;

    async function fetchQueue() {
      if (!selectedBusinessId) {
        setLoadingQueue(false);
        return;
      }

      try {
        const res = await providerApi.getBusinessQueue(selectedBusinessId);
        if (isMounted && res?.data) {
          const list = Array.isArray(res.data) ? res.data : [];
          setQueueEntries(list);
        }
      } catch (err) {
        if (isMounted) {
          setErrorMessage((prev) => prev || err.message || "Failed to load live walk-in queue.");
        }
      } finally {
        if (isMounted) {
          setLoadingQueue(false);
        }
      }
    }

    fetchQueue();

    const interval = setInterval(() => {
      fetchQueue();
    }, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedBusinessId, reloadTrigger]);

  // Identify currently called / serving customer
  const calledOrServing = queueEntries.find(
    (e) => e.status === "called" || e.status === "serving"
  );
  const waitingEntries = queueEntries.filter((e) => e.status === "waiting");

  // Keep selected customer dossier in sync with active entry
  const activeDossier = selectedEntry || calledOrServing || waitingEntries[0] || null;

  // Actions
  const handleCallNext = async () => {
    try {
      setActionInProgress(true);
      setErrorMessage("");
      setSuccessMessage("");

      const res = await providerApi.callNext(selectedBusinessId);
      if (res?.data) {
        setSuccessMessage(`Called next token #${res.data.tokenDisplay}!`);
      } else {
        setSuccessMessage("Queue is currently empty. No waiting customers.");
      }
      triggerReload();
    } catch (err) {
      setErrorMessage(err.message || "Failed to call next token.");
    } finally {
      setActionInProgress(false);
    }
  };

  const handleCallSpecific = async (queueEntryId) => {
    try {
      setActionInProgress(true);
      setErrorMessage("");
      setSuccessMessage("");

      const res = await providerApi.callSpecific(selectedBusinessId, queueEntryId);
      if (res?.data) {
        setSuccessMessage(`Called customer token #${res.data.tokenDisplay}!`);
      }
      triggerReload();
    } catch (err) {
      setErrorMessage(err.message || "Failed to call customer.");
    } finally {
      setActionInProgress(false);
    }
  };

  const handleCompleteEntry = async (queueEntryId) => {
    try {
      setActionInProgress(true);
      setErrorMessage("");
      setSuccessMessage("");

      await providerApi.completeQueueEntry(selectedBusinessId, queueEntryId);
      setSuccessMessage("Customer visit marked as completed.");
      if (selectedEntry?._id === queueEntryId) setSelectedEntry(null);
      triggerReload();
    } catch (err) {
      setErrorMessage(err.message || "Failed to complete queue visit.");
    } finally {
      setActionInProgress(false);
    }
  };

  const handleSkipEntry = async (queueEntryId) => {
    const reason = window.prompt("Reason for skipping this customer (optional):", "Customer absent / no-show");
    if (reason === null) return;

    try {
      setActionInProgress(true);
      setErrorMessage("");
      setSuccessMessage("");

      await providerApi.skipQueueEntry(selectedBusinessId, queueEntryId, reason.trim());
      setSuccessMessage("Customer skipped.");
      if (selectedEntry?._id === queueEntryId) setSelectedEntry(null);
      triggerReload();
    } catch (err) {
      setErrorMessage(err.message || "Failed to skip customer.");
    } finally {
      setActionInProgress(false);
    }
  };

  const venueName = selectedBusiness?.name || "Selected Venue";
  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

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

          {/* 1. Queue Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                Live Operations • Auto-refreshing (10s)
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827]">
                Queue Management Desk
              </h1>
              <p className="text-xs text-[#64748B] mt-0.5">
                {venueName} • {todayFormatted}
              </p>
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></span>
                Queue Status: Live Active
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

          {/* Queue Statistics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-2xs text-center">
              <span className="text-xs font-semibold text-[#64748B] block">Waiting in Line</span>
              <strong className="text-2xl font-black text-[#2563EB] mt-0.5 block">
                {waitingEntries.length}
              </strong>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-2xs text-center">
              <span className="text-xs font-semibold text-[#64748B] block">Called / Serving</span>
              <strong className="text-2xl font-black text-emerald-700 mt-0.5 block">
                {calledOrServing ? "1" : "0"}
              </strong>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-2xs text-center">
              <span className="text-xs font-semibold text-[#64748B] block">Total Active Tokens</span>
              <strong className="text-2xl font-black text-[#111827] mt-0.5 block">
                {queueEntries.length}
              </strong>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-2xs text-center">
              <span className="text-xs font-semibold text-[#64748B] block">Venue Grace Period</span>
              <strong className="text-xl font-black text-amber-700 mt-0.5 block">
                {selectedBusiness?.policies?.gracePeriodMinutes || 10} Mins
              </strong>
            </div>
          </div>

          {/* Main Layout: Operating Station (Left) & Customer Detail Panel (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Currently Serving, Queue Controls, Grace Period, and Next Customers */}
            <div className="lg:col-span-8 space-y-6">
              {/* Currently Serving Block */}
              <div className="bg-white p-6 rounded-xl border-2 border-[#2563EB] shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                    CURRENT STATION DESK
                  </span>
                  <span className="text-xs text-[#64748B]">
                    {calledOrServing
                      ? `Called at ${new Date(calledOrServing.calledAt || calledOrServing.joinedAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`
                      : "Station idle"}
                  </span>
                </div>

                {calledOrServing ? (
                  <div className="flex flex-wrap items-baseline justify-between gap-4 py-2 border-b border-[#E2E8F0]">
                    <div>
                      <span className="text-xs font-semibold text-[#64748B] block">
                        CALLED TOKEN
                      </span>
                      <strong className="text-5xl font-black text-[#2563EB] tracking-tight block mt-0.5">
                        #{calledOrServing.tokenDisplay}
                      </strong>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs font-semibold text-[#64748B] block">
                        Active Patron
                      </span>
                      <strong className="text-xl font-bold text-[#111827] block mt-0.5">
                        {calledOrServing.customerId?.name || "Walk-in Guest"}
                      </strong>
                      <span className="text-xs text-[#64748B] block mt-0.5">
                        {calledOrServing.serviceSnapshot?.name || "General Visit"}
                        {calledOrServing.serviceSnapshot?.duration && ` (~${calledOrServing.serviceSnapshot.duration}m)`}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-[#64748B] border-b border-[#E2E8F0] space-y-1">
                    <p className="font-semibold text-sm text-[#111827]">Station Ready</p>
                    <p>No customer token is currently called. Click &quot;Call Next Token&quot; to advance the queue line.</p>
                  </div>
                )}

                {/* Queue Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCallNext}
                    disabled={actionInProgress || waitingEntries.length === 0}
                    className="min-h-[44px] flex items-center justify-center py-2.5 px-3 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors shadow-2xs text-center cursor-pointer disabled:cursor-not-allowed"
                  >
                    Call Next Token (FIFO)
                  </button>

                  <button
                    type="button"
                    onClick={() => calledOrServing && handleCompleteEntry(calledOrServing._id)}
                    disabled={actionInProgress || !calledOrServing}
                    className="min-h-[44px] flex items-center justify-center py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors shadow-2xs text-center cursor-pointer disabled:cursor-not-allowed"
                  >
                    Complete Service
                  </button>

                  <button
                    type="button"
                    onClick={() => calledOrServing && handleSkipEntry(calledOrServing._id)}
                    disabled={actionInProgress || !calledOrServing}
                    className="min-h-[44px] flex items-center justify-center py-2.5 px-3 bg-white hover:bg-slate-50 border border-[#E2E8F0] disabled:opacity-50 text-[#111827] font-semibold text-xs rounded-lg transition-colors text-center cursor-pointer disabled:cursor-not-allowed"
                  >
                    Skip Customer
                  </button>
                </div>
              </div>

              {/* Grace Period Visualization */}
              <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                    Grace Period Protocol
                  </h2>
                  <span className="text-xs text-[#64748B]">
                    Active window: {selectedBusiness?.policies?.gracePeriodMinutes || 10} minutes
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {gracePeriodStages.map((stage, idx) => (
                    <div
                      key={stage.label}
                      className="p-3 rounded-lg border text-center text-xs bg-[#F8FAFC] border-slate-200 text-[#64748B]"
                    >
                      <span className="text-xs uppercase font-bold text-[#3730A3] block">
                        Phase {idx + 1}
                      </span>
                      <strong className="block mt-1 text-[#111827]">{stage.label}</strong>
                      <span className="text-[11px] text-[#64748B] block mt-0.5">{stage.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Customers in Line */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between text-xs">
                  <h2 className="font-bold text-[#111827]">
                    Waiting in Queue ({waitingEntries.length})
                  </h2>
                  <span className="text-[#64748B]">FIFO sequence order</span>
                </div>

                {loadingQueue ? (
                  <div className="py-12 text-center text-xs text-[#64748B]">
                    Updating queue list...
                  </div>
                ) : waitingEntries.length === 0 ? (
                  <div className="py-12 text-center text-xs text-[#64748B]">
                    No customers currently waiting in line.
                  </div>
                ) : (
                  <div className="divide-y divide-[#E2E8F0]">
                    {waitingEntries.map((cust) => {
                      const custName = cust.customerId?.name || "Walk-in Guest";
                      const svcName = cust.serviceSnapshot?.name || "General Visit";
                      const svcDuration = cust.serviceSnapshot?.duration ? `${cust.serviceSnapshot.duration} min` : "Standard";

                      return (
                        <div
                          key={cust._id}
                          onClick={() => setSelectedEntry(cust)}
                          className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-50/80 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <span className="h-8 w-14 rounded-md bg-[#EFF6FF] text-[#2563EB] font-black flex items-center justify-center text-xs">
                              {cust.tokenDisplay}
                            </span>
                            <div>
                              <strong className="text-[#111827] block">{custName}</strong>
                              <span className="text-[#64748B] text-xs block">
                                {svcName} • Est. {svcDuration}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-[#64748B] border border-slate-200">
                              Position #{cust.position || 1}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCallSpecific(cust._id);
                              }}
                              disabled={actionInProgress}
                              className="px-2.5 py-1 bg-[#2563EB] hover:bg-blue-700 text-white rounded text-xs font-semibold cursor-pointer shadow-2xs"
                            >
                              Call This Token
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Customer Information Panel */}
            <div className="lg:col-span-4 sticky top-24">
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs p-5 space-y-4">
                <div className="pb-3 border-b border-[#E2E8F0]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#3730A3]">
                    Customer Dossier
                  </span>
                  <h2 className="text-sm font-bold text-[#111827] mt-0.5">
                    Patron Details
                  </h2>
                </div>

                {activeDossier ? (
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-[#64748B] block">Customer Name</span>
                      <strong className="text-sm text-[#111827] block mt-0.5">
                        {activeDossier.customerId?.name || "Walk-in Guest"}
                      </strong>
                    </div>

                    <div>
                      <span className="text-[#64748B] block">Assigned Token</span>
                      <strong className="text-base text-[#2563EB] font-bold block mt-0.5">
                        #{activeDossier.tokenDisplay}
                      </strong>
                    </div>

                    <div>
                      <span className="text-[#64748B] block">Contact Information</span>
                      <p className="text-[#111827] mt-0.5">
                        Phone: {activeDossier.customerId?.phone || "—"}
                      </p>
                      <p className="text-[#111827]">
                        Email: {activeDossier.customerId?.email || "—"}
                      </p>
                    </div>

                    <div>
                      <span className="text-[#64748B] block">Selected Service</span>
                      <p className="text-[#111827] mt-0.5 font-medium leading-relaxed">
                        {activeDossier.serviceSnapshot?.name || "General Walk-in Visit"}
                      </p>
                      {activeDossier.serviceSnapshot?.price && (
                        <p className="text-[#64748B]">
                          Price: ₹{activeDossier.serviceSnapshot.price} • Duration: ~{activeDossier.serviceSnapshot.duration} min
                        </p>
                      )}
                    </div>

                    {activeDossier.notes && (
                      <div>
                        <span className="text-[#64748B] block">Customer Notes</span>
                        <p className="text-slate-600 mt-0.5 italic">{activeDossier.notes}</p>
                      </div>
                    )}

                    <div className="pt-2 border-t border-[#E2E8F0]">
                      <span className="text-[#64748B] block">Queue Timestamp</span>
                      <p className="text-xs text-[#64748B] mt-1">
                        Token generated at{" "}
                        {new Date(activeDossier.joinedAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-[#64748B]">
                    Select a customer token to view their dossier.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Queue;
