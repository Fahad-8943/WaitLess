import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router";
import AdminNav from "../components/AdminNav";
import { adminApi } from "../../../api/auth";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function BusinessDetails() {
  const { businessId } = useParams();
  const location = useLocation();
  const stateBusiness = location.state?.business;

  const stateOwner = stateBusiness?.ownerId;

  const [business, setBusiness] = useState(stateBusiness || null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(!stateBusiness);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [reloadTrigger, setReloadTrigger] = useState(0);

  // Confirmation Modal state
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "", // "approve" | "reject" | "suspend" | "reactivate"
    reason: "",
    busy: false,
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchDetails() {
      setLoading(true);
      setErrorMessage("");
      try {
        const [bizRes, svcRes] = await Promise.all([
          adminApi.getBusinessDetails(businessId),
          adminApi.getBusinessServices(businessId).catch(() => ({ data: { services: [] } })),
        ]);

        if (!isMounted) return;

        const fetchedBiz = bizRes?.data?.business || bizRes?.data;
        if (fetchedBiz) {
          // If fetchedBiz.ownerId is not populated with name, but stateOwner had it, preserve it
          if (
            typeof fetchedBiz.ownerId === "string" &&
            stateOwner?.name
          ) {
            fetchedBiz.ownerId = stateOwner;
          }
          setBusiness(fetchedBiz);
        }

        const svcs = svcRes?.data?.services || svcRes?.data || [];
        setServices(Array.isArray(svcs) ? svcs : []);
      } catch (err) {
        if (!isMounted) return;
        setErrorMessage(err?.message || "Failed to load business details.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (businessId) {
      fetchDetails();
    }

    return () => {
      isMounted = false;
    };
  }, [businessId, stateOwner, reloadTrigger]);

  const openModal = (type) => {
    setModalConfig({
      isOpen: true,
      type,
      reason: "",
      busy: false,
    });
  };

  const closeModal = () => {
    if (modalConfig.busy) return;
    setModalConfig({
      isOpen: false,
      type: "",
      reason: "",
      busy: false,
    });
  };

  const handleConfirmAction = async () => {
    if (!business?._id) return;
    const { type, reason } = modalConfig;

    setModalConfig((prev) => ({ ...prev, busy: true }));
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (type === "approve") {
        await adminApi.approveBusiness(business._id);
        setSuccessMessage(`Business "${business.name}" has been approved successfully.`);
      } else if (type === "reject") {
        await adminApi.rejectBusiness(business._id, reason);
        setSuccessMessage(`Business application for "${business.name}" has been rejected.`);
      } else if (type === "suspend") {
        await adminApi.suspendBusiness(business._id, reason);
        setSuccessMessage(`Business venue "${business.name}" has been suspended.`);
      } else if (type === "reactivate") {
        await adminApi.reactivateBusiness(business._id);
        setSuccessMessage(`Business venue "${business.name}" has been reactivated.`);
      }

      setModalConfig({ isOpen: false, type: "", reason: "", busy: false });
      setReloadTrigger((c) => c + 1);
    } catch (err) {
      setErrorMessage(err?.message || `Failed to perform ${type} on business.`);
      setModalConfig((prev) => ({ ...prev, busy: false }));
    }
  };

  const ownerName =
    typeof business?.ownerId === "object" && business?.ownerId?.name
      ? business.ownerId.name
      : "Provider User";
  const ownerEmail =
    typeof business?.ownerId === "object" && business?.ownerId?.email
      ? business.ownerId.email
      : business?.contact?.email || "—";
  const ownerPhone =
    typeof business?.ownerId === "object" && business?.ownerId?.phone
      ? business.ownerId.phone
      : business?.contact?.phone || "—";

  const fullAddress = business?.address
    ? `${business.address.street}, ${business.address.city}, ${business.address.state} ${business.address.postalCode}, ${business.address.country || "IN"}`
    : "—";

  const coordinates = business?.location?.coordinates
    ? `[${business.location.coordinates[0].toFixed(5)}, ${business.location.coordinates[1].toFixed(5)}]`
    : "—";

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans">
      <AdminNav />

      <main className="flex-grow py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <Link to="/admin/businesses" className="hover:text-[#2563EB] transition-colors">
              &larr; Back to Business Directory
            </Link>
            <span>/</span>
            <span className="text-[#111827]">{business?.name || "Business Details"}</span>
          </div>

          {/* Feedback Messages */}
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

          {loading ? (
            <div className="py-20 text-center text-xs text-[#64748B] space-y-3">
              <div className="inline-block h-8 w-8 rounded-full border-2 border-[#2563EB] border-t-transparent animate-spin" />
              <p>Loading business details and service records...</p>
            </div>
          ) : !business ? (
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs p-12 text-center text-xs text-[#64748B] space-y-3">
              <p>Business venue record not found.</p>
              <Link
                to="/admin/businesses"
                className="inline-block px-3 py-1.5 bg-[#2563EB] text-white rounded-lg font-semibold text-xs"
              >
                Return to Directory
              </Link>
            </div>
          ) : (
            <>
              {/* Header & Status Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827]">
                    Business Application: {business.name}
                  </h1>
                  <p className="mt-0.5 text-xs sm:text-sm text-[#64748B]">
                    Review venue identity, registered address, operating hours, and active services.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {business.approvalStatus === "pending" && (
                    <>
                      <button
                        type="button"
                        onClick={() => openModal("approve")}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-2xs cursor-pointer"
                      >
                        Approve Business
                      </button>
                      <button
                        type="button"
                        onClick={() => openModal("reject")}
                        className="px-3.5 py-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        Reject Business
                      </button>
                    </>
                  )}

                  {business.approvalStatus === "approved" && (
                    <button
                      type="button"
                      onClick={() => openModal("suspend")}
                      className="px-3.5 py-2 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      Suspend Business
                    </button>
                  )}

                  {business.approvalStatus === "suspended" && (
                    <button
                      type="button"
                      onClick={() => openModal("reactivate")}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-2xs cursor-pointer"
                    >
                      Reactivate Business
                    </button>
                  )}

                  {business.approvalStatus === "rejected" && (
                    <button
                      type="button"
                      onClick={() => openModal("approve")}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-2xs cursor-pointer"
                    >
                      Approve Business
                    </button>
                  )}
                </div>
              </div>

              {/* Main Information Container */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs p-6 space-y-6 text-xs">
                {/* Identity & Status */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E2E8F0]">
                  <div>
                    <h2 className="text-lg font-bold text-[#111827]">
                      {business.name}
                    </h2>
                    <span className="text-[11px] font-semibold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded mt-1 inline-block border border-[#BFDBFE]">
                      Category: {business.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded text-xs font-semibold border ${
                        business.approvalStatus === "approved"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : business.approvalStatus === "pending"
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : business.approvalStatus === "suspended"
                          ? "bg-rose-50 text-rose-800 border-rose-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      Status: {business.approvalStatus}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                        business.isActive
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                      }`}
                    >
                      {business.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <span className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">
                    Business Description
                  </span>
                  <p className="text-xs text-[#111827] leading-relaxed">
                    {business.description || "No description provided by business owner."}
                  </p>
                </div>

                {/* Owner Information & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E2E8F0]">
                  <div className="space-y-1">
                    <span className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">
                      Owner Details
                    </span>
                    <p className="text-[#111827]">
                      Name: <strong>{ownerName}</strong>
                    </p>
                    <p className="text-[#111827]">Email: {ownerEmail}</p>
                    <p className="text-[#111827]">Phone: {ownerPhone}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">
                      Address &amp; Location
                    </span>
                    <p className="text-[#111827] leading-relaxed">{fullAddress}</p>
                    <p className="text-[11px] text-[#64748B] mt-1">Coordinates: {coordinates}</p>
                  </div>
                </div>

                {/* Services Catalog */}
                <div className="pt-4 border-t border-[#E2E8F0] space-y-2">
                  <span className="block text-[11px] font-semibold text-[#64748B] uppercase">
                    Configured Services ({services.length})
                  </span>
                  {services.length === 0 ? (
                    <div className="p-4 border border-dashed border-[#E2E8F0] rounded-lg text-center text-[#64748B]">
                      No services configured for this business venue yet.
                    </div>
                  ) : (
                    <div className="divide-y divide-[#E2E8F0] border border-[#E2E8F0] rounded-lg">
                      {services.map((svc) => (
                        <div key={svc._id || svc.name} className="p-3 flex items-center justify-between">
                          <div>
                            <strong className="text-[#111827] block">{svc.name}</strong>
                            <span className="text-[#64748B] text-[11px]">
                              Duration: ~{svc.duration} min • {svc.isActive ? "Active" : "Inactive"}
                            </span>
                            {svc.description && (
                              <p className="text-[#64748B] text-[11px] mt-0.5">{svc.description}</p>
                            )}
                          </div>
                          <strong className="text-[#111827]">₹{svc.price}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Operating Schedule */}
                <div className="pt-4 border-t border-[#E2E8F0] space-y-2">
                  <span className="block text-[11px] font-semibold text-[#64748B] uppercase">
                    Operating Schedule
                  </span>
                  {(!business.operatingHours || business.operatingHours.length === 0) ? (
                    <div className="p-3 border border-dashed border-[#E2E8F0] rounded-lg text-center text-[#64748B]">
                      Standard operating schedule not specified.
                    </div>
                  ) : (
                    <div className="divide-y divide-[#E2E8F0] border border-[#E2E8F0] rounded-lg">
                      {business.operatingHours.map((h, idx) => {
                        const dayName = DAY_NAMES[h.dayOfWeek] || `Day ${h.dayOfWeek}`;
                        const hoursStr = h.isClosed ? "Closed" : `${h.openTime} – ${h.closeTime}`;
                        return (
                          <div key={idx} className="p-2.5 flex items-center justify-between">
                            <span className="text-[#111827] font-medium">{dayName}</span>
                            <span className={h.isClosed ? "text-rose-600 font-semibold" : "text-[#64748B]"}>
                              {hoursStr}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Operational Policies */}
                <div className="pt-4 border-t border-[#E2E8F0] space-y-2">
                  <span className="block text-[11px] font-semibold text-[#64748B] uppercase">
                    Venue Policies
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-[#E2E8F0]">
                    <div>
                      <span className="text-[#64748B] text-[10px] uppercase block">Max Capacity</span>
                      <strong className="text-xs text-[#111827]">
                        {business.policies?.maxQueueCapacity ?? 50}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[#64748B] text-[10px] uppercase block">Remote Queue</span>
                      <strong className="text-xs text-[#111827]">
                        {business.policies?.remoteQueueEnabled !== false ? "Enabled" : "Disabled"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[#64748B] text-[10px] uppercase block">Grace Period</span>
                      <strong className="text-xs text-[#111827]">
                        {business.policies?.gracePeriodMinutes ?? 10} min
                      </strong>
                    </div>
                    <div>
                      <span className="text-[#64748B] text-[10px] uppercase block">Timezone</span>
                      <strong className="text-xs text-[#111827]">
                        {business.timezone || "Asia/Kolkata"}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Confirmation & Reason Modal */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 border border-slate-200 text-xs">
            <h3 className="text-base font-bold text-[#111827]">
              {modalConfig.type === "approve" && "Approve Business Application"}
              {modalConfig.type === "reject" && "Reject Business Application"}
              {modalConfig.type === "suspend" && "Suspend Business Venue"}
              {modalConfig.type === "reactivate" && "Reactivate Business Venue"}
            </h3>

            <p className="text-[#64748B] text-xs leading-relaxed">
              {modalConfig.type === "approve" && (
                <>
                  Are you sure you want to approve <strong>{business?.name}</strong>?
                  The business will be marked as approved and active for public customer discovery.
                </>
              )}
              {modalConfig.type === "reject" && (
                <>
                  Are you sure you want to reject the application for <strong>{business?.name}</strong>?
                  You may optionally provide a reason for rejection below.
                </>
              )}
              {modalConfig.type === "suspend" && (
                <>
                  Are you sure you want to suspend <strong>{business?.name}</strong>?
                  The business will be hidden from customer search, and all provider operations will be halted.
                </>
              )}
              {modalConfig.type === "reactivate" && (
                <>
                  Are you sure you want to reactivate <strong>{business?.name}</strong>?
                  The business will be marked as approved and active.
                </>
              )}
            </p>

            {(modalConfig.type === "reject" || modalConfig.type === "suspend") && (
              <div className="space-y-1.5">
                <label
                  htmlFor="admin-reason-modal"
                  className="block text-[11px] font-semibold text-[#64748B] uppercase"
                >
                  Reason (Optional, max 500 characters)
                </label>
                <textarea
                  id="admin-reason-modal"
                  rows={3}
                  maxLength={500}
                  value={modalConfig.reason}
                  onChange={(e) =>
                    setModalConfig((prev) => ({ ...prev, reason: e.target.value }))
                  }
                  placeholder="Explain reason for this action..."
                  className="w-full p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs text-[#111827] focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
              <button
                type="button"
                disabled={modalConfig.busy}
                onClick={closeModal}
                className="px-3.5 py-1.5 rounded-lg border border-[#E2E8F0] text-[#64748B] hover:bg-slate-50 font-semibold cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={modalConfig.busy}
                onClick={handleConfirmAction}
                className={`px-3.5 py-1.5 rounded-lg text-white font-semibold cursor-pointer disabled:opacity-50 shadow-2xs ${
                  modalConfig.type === "reject" || modalConfig.type === "suspend"
                    ? "bg-rose-600 hover:bg-rose-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {modalConfig.busy ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BusinessDetails;
