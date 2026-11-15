import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import AdminNav from "../components/AdminNav";
import { adminApi } from "../../../api/auth";

const STATUS_TABS = [
  { label: "All", value: "all" },
  { label: "Pending Applications", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Suspended", value: "suspended" },
  { label: "Rejected", value: "rejected" },
];

function Businesses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get("status") || "all";

  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [searchQuery, setSearchQuery] = useState("");
  const [businesses, setBusinesses] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [reloadTrigger, setReloadTrigger] = useState(0);

  // Confirmation Modal state
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "", // "approve" | "reject" | "suspend" | "reactivate"
    business: null,
    reason: "",
    busy: false,
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchBusinesses() {
      setLoading(true);
      setErrorMessage("");
      try {
        const params = {
          page: pagination.page,
          limit: pagination.limit,
        };
        if (statusFilter && statusFilter !== "all") {
          params.approvalStatus = statusFilter;
        }
        if (searchQuery.trim()) {
          params.search = searchQuery.trim();
        }

        const res = await adminApi.listBusinesses(params);
        if (!isMounted) return;

        if (res?.data) {
          setBusinesses(res.data);
          if (res.meta) {
            setPagination(res.meta);
          }
        }
      } catch (err) {
        if (!isMounted) return;
        setErrorMessage(err?.message || "Failed to load businesses list.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchBusinesses();
    return () => {
      isMounted = false;
    };
  }, [statusFilter, searchQuery, pagination.page, pagination.limit, reloadTrigger]);

  const handleTabChange = (status) => {
    setStatusFilter(status);
    setPagination((prev) => ({ ...prev, page: 1 }));
    setSearchParams(status !== "all" ? { status } : {});
  };

  const openModal = (type, business) => {
    setModalConfig({
      isOpen: true,
      type,
      business,
      reason: "",
      busy: false,
    });
  };

  const closeModal = () => {
    if (modalConfig.busy) return;
    setModalConfig({
      isOpen: false,
      type: "",
      business: null,
      reason: "",
      busy: false,
    });
  };

  const handleConfirmAction = async () => {
    const { type, business, reason } = modalConfig;
    if (!business?._id) return;

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

      setModalConfig({ isOpen: false, type: "", business: null, reason: "", busy: false });
      setReloadTrigger((c) => c + 1);
    } catch (err) {
      setErrorMessage(err?.message || `Failed to perform ${type} on business.`);
      setModalConfig((prev) => ({ ...prev, busy: false }));
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans">
      <AdminNav />

      <main className="flex-grow py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827]">
                Business Directory
              </h1>
              <p className="mt-0.5 text-xs sm:text-sm text-[#64748B]">
                Manage business applications, active businesses, and directory records.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {STATUS_TABS.map((tab) => {
                const isActive = statusFilter === tab.value;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => handleTabChange(tab.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                      isActive
                        ? "bg-[#111827] text-white border-[#111827]"
                        : tab.value === "pending"
                        ? "bg-white text-amber-800 border-amber-200 hover:bg-amber-50"
                        : tab.value === "approved"
                        ? "bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50"
                        : tab.value === "suspended"
                        ? "bg-white text-rose-800 border-rose-200 hover:bg-rose-50"
                        : "bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-50"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search bar & Refresh */}
          <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-grow max-w-md">
              <span className="text-[#64748B] font-semibold text-[11px] uppercase">Search:</span>
              <input
                type="text"
                placeholder="Search by business name or city..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className="w-full px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs text-[#111827] focus:outline-none focus:border-[#2563EB]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer underline"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 text-[#64748B]">
              <span>
                Total Venues: <strong className="text-[#111827]">{pagination.total}</strong>
              </span>
              <button
                type="button"
                onClick={() => setReloadTrigger((c) => c + 1)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-[#111827] rounded text-xs font-semibold cursor-pointer transition-colors"
              >
                ↻ Refresh
              </button>
            </div>
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

          {/* Businesses Directory */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
            {loading ? (
              <div className="py-16 text-center text-xs text-[#64748B] space-y-3">
                <div className="inline-block h-8 w-8 rounded-full border-2 border-[#2563EB] border-t-transparent animate-spin" />
                <p>Loading business directory records...</p>
              </div>
            ) : businesses.length === 0 ? (
              <div className="py-16 text-center text-xs text-[#64748B] space-y-2">
                <p>No business records found matching the selected filter criteria.</p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Business</th>
                        <th className="py-3 px-4">Owner</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Location</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Registered</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {businesses.map((biz) => {
                        const ownerName = biz.ownerId?.name || "—";
                        const ownerContact = biz.ownerId?.email || biz.ownerId?.phone || "";
                        const location = biz.address?.city
                          ? `${biz.address.street ? `${biz.address.street}, ` : ""}${biz.address.city}`
                          : "—";
                        const regDate = biz.createdAt
                          ? new Date(biz.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "—";

                        return (
                          <tr key={biz._id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-3.5 px-4">
                              <strong className="text-[#111827] block">{biz.name}</strong>
                              <span className="text-[11px] text-[#2563EB] block mt-0.5">
                                {biz.category}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-[#64748B]">
                              <strong className="text-[#111827] block">{ownerName}</strong>
                              <span className="text-[11px] block mt-0.5">{ownerContact}</span>
                            </td>
                            <td className="py-3.5 px-4 text-[#64748B]">{biz.category}</td>
                            <td className="py-3.5 px-4 text-[#64748B] max-w-xs truncate">
                              {location}
                            </td>
                            <td className="py-3.5 px-4 space-y-1">
                              <div>
                                <span
                                  className={`px-2 py-0.5 rounded text-[11px] font-semibold capitalize border ${
                                    biz.approvalStatus === "approved"
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      : biz.approvalStatus === "pending"
                                      ? "bg-amber-50 text-amber-800 border-amber-200"
                                      : biz.approvalStatus === "suspended"
                                      ? "bg-rose-50 text-rose-800 border-rose-200"
                                      : "bg-slate-100 text-slate-700 border-slate-200"
                                  }`}
                                >
                                  {biz.approvalStatus}
                                </span>
                              </div>
                              <div>
                                <span
                                  className={`px-1.5 py-0.2 rounded text-[10px] font-medium border ${
                                    biz.isActive
                                      ? "bg-blue-50 text-blue-700 border-blue-200"
                                      : "bg-slate-100 text-slate-500 border-slate-200"
                                  }`}
                                >
                                  {biz.isActive ? "Active" : "Inactive"}
                                </span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-[#64748B] text-[11px]">
                              {regDate}
                            </td>
                            <td className="py-3.5 px-4 text-right space-x-1.5">
                              <Link
                                to={`/admin/businesses/${biz._id}`}
                                state={{ business: biz }}
                                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[#111827] font-semibold text-[11px] transition-colors inline-block"
                              >
                                Review Business
                              </Link>

                              {biz.approvalStatus === "pending" && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => openModal("approve", biz)}
                                    className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] transition-colors cursor-pointer"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => openModal("reject", biz)}
                                    className="px-2.5 py-1 rounded bg-white hover:bg-red-50 text-red-600 border border-red-200 font-semibold text-[11px] transition-colors cursor-pointer"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}

                              {biz.approvalStatus === "approved" && (
                                <button
                                  type="button"
                                  onClick={() => openModal("suspend", biz)}
                                  className="px-2.5 py-1 rounded bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 font-semibold text-[11px] transition-colors cursor-pointer"
                                >
                                  Suspend
                                </button>
                              )}

                              {biz.approvalStatus === "suspended" && (
                                <button
                                  type="button"
                                  onClick={() => openModal("reactivate", biz)}
                                  className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] transition-colors cursor-pointer"
                                >
                                  Reactivate
                                </button>
                              )}

                              {biz.approvalStatus === "rejected" && (
                                <button
                                  type="button"
                                  onClick={() => openModal("approve", biz)}
                                  className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] transition-colors cursor-pointer"
                                >
                                  Approve
                                </button>
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
                  {businesses.map((biz) => {
                    const ownerName = biz.ownerId?.name || "—";
                    const location = biz.address?.city
                      ? `${biz.address.street ? `${biz.address.street}, ` : ""}${biz.address.city}`
                      : "—";

                    return (
                      <div key={biz._id} className="p-4 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <strong className="text-sm font-bold text-[#111827]">
                            {biz.name}
                          </strong>
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                              biz.approvalStatus === "approved"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : biz.approvalStatus === "pending"
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : biz.approvalStatus === "suspended"
                                ? "bg-rose-50 text-rose-800 border-rose-200"
                                : "bg-slate-100 text-slate-700 border-slate-200"
                            }`}
                          >
                            {biz.approvalStatus}
                          </span>
                        </div>

                        <div className="text-xs text-[#64748B] space-y-0.5">
                          <div>
                            Owner: <strong className="text-[#111827]">{ownerName}</strong> • {biz.category}
                          </div>
                          <div>Location: {location}</div>
                        </div>

                        <div className="pt-2 flex flex-wrap items-center gap-2">
                          <Link
                            to={`/admin/businesses/${biz._id}`}
                            state={{ business: biz }}
                            className="px-3 py-1.5 rounded bg-slate-100 text-[#111827] font-semibold text-xs"
                          >
                            Review Business
                          </Link>

                          {biz.approvalStatus === "pending" && (
                            <>
                              <button
                                type="button"
                                onClick={() => openModal("approve", biz)}
                                className="px-3 py-1.5 rounded bg-emerald-600 text-white font-semibold text-xs"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => openModal("reject", biz)}
                                className="px-3 py-1.5 rounded bg-white text-red-600 border border-red-200 font-semibold text-xs"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {biz.approvalStatus === "approved" && (
                            <button
                              type="button"
                              onClick={() => openModal("suspend", biz)}
                              className="px-3 py-1.5 rounded bg-white text-rose-700 border border-rose-200 font-semibold text-xs"
                            >
                              Suspend
                            </button>
                          )}

                          {biz.approvalStatus === "suspended" && (
                            <button
                              type="button"
                              onClick={() => openModal("reactivate", biz)}
                              className="px-3 py-1.5 rounded bg-emerald-600 text-white font-semibold text-xs"
                            >
                              Reactivate
                            </button>
                          )}

                          {biz.approvalStatus === "rejected" && (
                            <button
                              type="button"
                              onClick={() => openModal("approve", biz)}
                              className="px-3 py-1.5 rounded bg-emerald-600 text-white font-semibold text-xs"
                            >
                              Approve
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="p-3.5 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
                    <span>
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={pagination.page <= 1}
                        onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-50 font-semibold text-xs transition-colors cursor-pointer"
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        disabled={pagination.page >= pagination.totalPages}
                        onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-50 font-semibold text-xs transition-colors cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
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
                  Are you sure you want to approve <strong>{modalConfig.business?.name}</strong>?
                  The business will be marked as approved and active for public customer discovery.
                </>
              )}
              {modalConfig.type === "reject" && (
                <>
                  Are you sure you want to reject the application for{" "}
                  <strong>{modalConfig.business?.name}</strong>? You may optionally provide a reason
                  for rejection below.
                </>
              )}
              {modalConfig.type === "suspend" && (
                <>
                  Are you sure you want to suspend <strong>{modalConfig.business?.name}</strong>?
                  The business will be hidden from customer search, and all provider operations will be halted.
                </>
              )}
              {modalConfig.type === "reactivate" && (
                <>
                  Are you sure you want to reactivate <strong>{modalConfig.business?.name}</strong>?
                  The business will be marked as approved and active.
                </>
              )}
            </p>

            {(modalConfig.type === "reject" || modalConfig.type === "suspend") && (
              <div className="space-y-1.5">
                <label
                  htmlFor="admin-reason-input"
                  className="block text-[11px] font-semibold text-[#64748B] uppercase"
                >
                  Reason (Optional, max 500 characters)
                </label>
                <textarea
                  id="admin-reason-input"
                  rows={3}
                  maxLength={500}
                  value={modalConfig.reason}
                  onChange={(e) =>
                    setModalConfig((prev) => ({ ...prev, reason: e.target.value }))
                  }
                  placeholder="Explain why this business is being rejected or suspended..."
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

export default Businesses;
