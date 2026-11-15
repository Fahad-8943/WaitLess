import { useState, useEffect } from "react";
import AdminNav from "../components/AdminNav";
import { adminApi } from "../../../api/auth";
import { useAuth } from "../../../context/AuthContext";

const ROLE_TABS = [
  { label: "All Users", value: "all" },
  { label: "Customers", value: "customer" },
  { label: "Providers", value: "provider" },
  { label: "Administrators", value: "admin" },
];

const STATUS_FILTERS = [
  { label: "All Statuses", value: "all" },
  { label: "Active", value: "true" },
  { label: "Deactivated", value: "false" },
];

function Users() {
  const { user: currentUser } = useAuth();

  const [usersList, setUsersList] = useState([]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [reloadTrigger, setReloadTrigger] = useState(0);

  // Status Change Confirmation Modal
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    user: null,
    targetStatus: false,
    busy: false,
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchUsers() {
      setLoading(true);
      setErrorMessage("");
      try {
        const params = {
          page: pagination.page,
          limit: pagination.limit,
        };
        if (roleFilter && roleFilter !== "all") {
          params.role = roleFilter;
        }
        if (statusFilter && statusFilter !== "all") {
          params.isActive = statusFilter;
        }
        if (searchQuery.trim()) {
          params.search = searchQuery.trim();
        }

        const res = await adminApi.listUsers(params);
        if (!isMounted) return;

        if (res?.data) {
          setUsersList(res.data);
          if (res.meta) {
            setPagination(res.meta);
          }
        }
      } catch (err) {
        if (!isMounted) return;
        setErrorMessage(err?.message || "Failed to load user accounts.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchUsers();
    return () => {
      isMounted = false;
    };
  }, [roleFilter, statusFilter, searchQuery, pagination.page, pagination.limit, reloadTrigger]);

  const openStatusModal = (user, targetStatus) => {
    setModalConfig({
      isOpen: true,
      user,
      targetStatus,
      busy: false,
    });
  };

  const closeStatusModal = () => {
    if (modalConfig.busy) return;
    setModalConfig({
      isOpen: false,
      user: null,
      targetStatus: false,
      busy: false,
    });
  };

  const handleConfirmStatusChange = async () => {
    const { user, targetStatus } = modalConfig;
    if (!user?._id) return;

    setModalConfig((prev) => ({ ...prev, busy: true }));
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await adminApi.updateUserStatus(user._id, targetStatus);
      const actionText = targetStatus ? "activated" : "deactivated";
      setSuccessMessage(`User "${user.name}" has been ${actionText} successfully.`);
      setModalConfig({ isOpen: false, user: null, targetStatus: false, busy: false });
      setReloadTrigger((c) => c + 1);
    } catch (err) {
      setErrorMessage(err?.message || "Failed to update user account status.");
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
                User Directory
              </h1>
              <p className="mt-0.5 text-xs sm:text-sm text-[#64748B]">
                Directory of customer, provider, and administrative accounts on the platform.
              </p>
            </div>
            <span className="text-xs text-[#64748B]">
              Registered Accounts: <strong className="text-[#111827]">{pagination.total}</strong>
            </span>
          </div>

          {/* Role Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {ROLE_TABS.map((tab) => {
              const isActive = roleFilter === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => {
                    setRoleFilter(tab.value);
                    setPagination((prev) => ({ ...prev, page: 1 }));
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                    isActive
                      ? "bg-[#111827] text-white border-[#111827]"
                      : "bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-50"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search bar & Status Filter */}
          <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-grow max-w-md">
              <span className="text-[#64748B] font-semibold text-[11px] uppercase">Search:</span>
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
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

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[#64748B] font-semibold text-[11px] uppercase">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPagination((prev) => ({ ...prev, page: 1 }));
                  }}
                  className="px-2.5 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs text-[#111827] focus:outline-none focus:border-[#2563EB]"
                >
                  {STATUS_FILTERS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => setReloadTrigger((c) => c + 1)}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#111827] rounded text-xs font-semibold cursor-pointer transition-colors"
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

          {/* Users Table */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
            {loading ? (
              <div className="py-16 text-center text-xs text-[#64748B] space-y-3">
                <div className="inline-block h-8 w-8 rounded-full border-2 border-[#2563EB] border-t-transparent animate-spin" />
                <p>Loading user accounts records...</p>
              </div>
            ) : usersList.length === 0 ? (
              <div className="py-16 text-center text-xs text-[#64748B] space-y-2">
                <p>No user accounts found matching current search and filter criteria.</p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Account Holder</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Phone</th>
                        <th className="py-3 px-4">Registration Date</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {usersList.map((user) => {
                        const isSelf =
                          currentUser?._id === user._id || currentUser?.id === user._id;
                        const regDate = user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "—";

                        return (
                          <tr key={user._id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-[#111827]">
                              <span>{user.name}</span>
                              {isSelf && (
                                <span className="ml-2 text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded font-bold">
                                  You
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-semibold capitalize border ${
                                  user.role === "admin"
                                    ? "bg-amber-50 text-amber-800 border-amber-200"
                                    : user.role === "provider"
                                    ? "bg-purple-50 text-purple-700 border-purple-200"
                                    : "bg-blue-50 text-blue-700 border-blue-200"
                                }`}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-[#64748B]">{user.email}</td>
                            <td className="py-3.5 px-4 text-[#64748B]">{user.phone || "—"}</td>
                            <td className="py-3.5 px-4 text-[#111827]">{regDate}</td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                                  user.isActive
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-rose-50 text-rose-800 border-rose-200"
                                }`}
                              >
                                {user.isActive ? "Active" : "Deactivated"}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              {user.isActive ? (
                                <button
                                  type="button"
                                  disabled={isSelf}
                                  onClick={() => openStatusModal(user, false)}
                                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                                    isSelf
                                      ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                                      : "bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 cursor-pointer"
                                  }`}
                                  title={isSelf ? "You cannot deactivate your own account" : undefined}
                                >
                                  Deactivate
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => openStatusModal(user, true)}
                                  className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                                >
                                  Activate
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
                <div className="md:hidden divide-y divide-[#E2E8F0]">
                  {usersList.map((user) => {
                    const isSelf =
                      currentUser?._id === user._id || currentUser?.id === user._id;
                    const regDate = user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—";

                    return (
                      <div key={user._id} className="p-4 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <strong className="text-sm font-bold text-[#111827]">
                              {user.name}
                            </strong>
                            {isSelf && (
                              <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded font-bold">
                                You
                              </span>
                            )}
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                              user.isActive
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-rose-50 text-rose-800 border-rose-200"
                            }`}
                          >
                            {user.isActive ? "Active" : "Deactivated"}
                          </span>
                        </div>

                        <div className="text-xs text-[#64748B] space-y-0.5">
                          <div>
                            Role: <strong className="text-[#111827] capitalize">{user.role}</strong> • Email:{" "}
                            <span className="text-[#111827]">{user.email}</span>
                          </div>
                          <div>
                            Phone: {user.phone || "—"} • Registered: {regDate}
                          </div>
                        </div>

                        <div className="pt-2">
                          {user.isActive ? (
                            <button
                              type="button"
                              disabled={isSelf}
                              onClick={() => openStatusModal(user, false)}
                              className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                                isSelf
                                  ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                                  : "bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 cursor-pointer"
                              }`}
                            >
                              Deactivate Account
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => openStatusModal(user, true)}
                              className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                            >
                              Activate Account
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

      {/* Account Status Change Confirmation Modal */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 border border-slate-200 text-xs">
            <h3 className="text-base font-bold text-[#111827]">
              {modalConfig.targetStatus ? "Activate User Account" : "Deactivate User Account"}
            </h3>

            <p className="text-[#64748B] text-xs leading-relaxed">
              {modalConfig.targetStatus ? (
                <>
                  Are you sure you want to activate the account for{" "}
                  <strong>{modalConfig.user?.name}</strong> ({modalConfig.user?.email})?
                  The user will regain login access and be permitted to use platform services.
                </>
              ) : (
                <>
                  Are you sure you want to deactivate the account for{" "}
                  <strong>{modalConfig.user?.name}</strong> ({modalConfig.user?.email})?
                  All active login sessions for this account will be invalidated immediately.
                </>
              )}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
              <button
                type="button"
                disabled={modalConfig.busy}
                onClick={closeStatusModal}
                className="px-3.5 py-1.5 rounded-lg border border-[#E2E8F0] text-[#64748B] hover:bg-slate-50 font-semibold cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={modalConfig.busy}
                onClick={handleConfirmStatusChange}
                className={`px-3.5 py-1.5 rounded-lg text-white font-semibold cursor-pointer disabled:opacity-50 shadow-2xs ${
                  modalConfig.targetStatus
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                {modalConfig.busy
                  ? "Processing..."
                  : modalConfig.targetStatus
                  ? "Confirm Activation"
                  : "Confirm Deactivation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
