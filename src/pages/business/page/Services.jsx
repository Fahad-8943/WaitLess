import { useState, useEffect, useCallback } from "react";
import BusinessNav from "../components/BusinessNav";
import BusinessSwitcher from "../components/BusinessSwitcher";
import { useProviderBusiness } from "../hooks/useProviderBusiness";
import { providerApi } from "../../../api/auth";

function Services() {
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

  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Modal / Form state for Add/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const triggerReload = useCallback(() => {
    setReloadTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function fetchServices() {
      if (!selectedBusinessId) {
        setLoadingServices(false);
        return;
      }

      try {
        setErrorMessage("");
        const res = await providerApi.getServices(selectedBusinessId);
        if (isMounted && res?.data?.services) {
          setServices(res.data.services);
        }
      } catch (err) {
        if (isMounted) {
          setErrorMessage(err.message || "Failed to load services for this venue.");
        }
      } finally {
        if (isMounted) {
          setLoadingServices(false);
        }
      }
    }

    fetchServices();

    return () => {
      isMounted = false;
    };
  }, [selectedBusinessId, reloadTrigger]);

  const handleOpenAdd = () => {
    setEditingServiceId(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      duration: "30",
      isActive: true,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (svc) => {
    setEditingServiceId(svc._id);
    setFormData({
      name: svc.name || "",
      description: svc.description || "",
      price: String(svc.price ?? ""),
      duration: String(svc.duration ?? "30"),
      isActive: svc.isActive ?? true,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingServiceId(null);
    setFormError("");
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setFormError("Service name must be at least 2 characters long.");
      return;
    }

    const numPrice = parseFloat(formData.price);
    if (isNaN(numPrice) || numPrice < 0) {
      setFormError("Price must be a valid non-negative number.");
      return;
    }

    const numDuration = parseInt(formData.duration, 10);
    if (isNaN(numDuration) || numDuration < 1) {
      setFormError("Duration must be an integer of at least 1 minute.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim() || "",
        price: numPrice,
        duration: numDuration,
        isActive: formData.isActive,
      };

      if (editingServiceId) {
        await providerApi.updateService(selectedBusinessId, editingServiceId, payload);
        setSuccessMessage("Service updated successfully.");
      } else {
        await providerApi.createService(selectedBusinessId, payload);
        setSuccessMessage("Service created successfully.");
      }

      setIsModalOpen(false);
      triggerReload();
    } catch (err) {
      setFormError(err.message || "Failed to save service. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle active/inactive state
  const handleToggleActive = async (svc) => {
    try {
      setErrorMessage("");
      setSuccessMessage("");
      const updatedStatus = !svc.isActive;
      await providerApi.updateService(selectedBusinessId, svc._id, {
        isActive: updatedStatus,
      });
      setSuccessMessage(`Service "${svc.name}" is now ${updatedStatus ? "Active" : "Inactive"}.`);
      triggerReload();
    } catch (err) {
      setErrorMessage(err.message || "Failed to toggle service status.");
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
                Service Menu
              </h1>
              <p className="mt-0.5 text-xs sm:text-sm text-[#64748B]">
                Configure offerings, set pricing, and specify average service durations for <strong>{venueName}</strong>.
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={handleOpenAdd}
                disabled={!selectedBusinessId}
                className="px-3.5 py-2 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors shadow-2xs cursor-pointer disabled:cursor-not-allowed"
              >
                + Add Service
              </button>
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

          {/* Desktop Table & Mobile Cards */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between text-xs">
              <span className="font-semibold text-[#111827]">
                Offerings ({services.length})
              </span>
              <span className="text-[#64748B]">Used for queue &amp; booking estimation</span>
            </div>

            {loadingBusinesses || loadingServices ? (
              <div className="py-16 text-center text-xs text-[#64748B] space-y-3">
                <div className="inline-block h-8 w-8 rounded-full border-2 border-[#2563EB] border-t-transparent animate-spin" />
                <p>Loading active services...</p>
              </div>
            ) : services.length === 0 ? (
              <div className="py-16 text-center text-xs text-[#64748B] space-y-3">
                <p>No services registered for this business venue yet.</p>
                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="inline-flex items-center justify-center px-4 py-2 bg-[#2563EB] text-white font-semibold text-xs rounded-lg hover:bg-blue-700 transition-colors shadow-2xs cursor-pointer"
                >
                  Create First Service
                </button>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Service</th>
                        <th className="py-3 px-4">Description</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Avg Duration</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {services.map((svc) => (
                        <tr key={svc._id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-[#111827]">
                            {svc.name}
                          </td>
                          <td className="py-3.5 px-4 text-[#64748B] max-w-sm truncate">
                            {svc.description || "—"}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-[#111827]">
                            ₹{svc.price}
                          </td>
                          <td className="py-3.5 px-4 text-[#2563EB] font-semibold">
                            ~{svc.duration} mins
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                                svc.isActive
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-slate-100 text-slate-600 border-slate-200"
                              }`}
                            >
                              {svc.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(svc)}
                              className="text-xs text-[#2563EB] hover:text-blue-800 font-semibold cursor-pointer underline"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleActive(svc)}
                              className={`text-xs font-semibold cursor-pointer underline ${
                                svc.isActive
                                  ? "text-slate-500 hover:text-slate-700"
                                  : "text-emerald-600 hover:text-emerald-800"
                              }`}
                            >
                              {svc.isActive ? "Deactivate" : "Activate"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards View */}
                <div className="md:hidden divide-y divide-[#E2E8F0]">
                  {services.map((svc) => (
                    <div key={svc._id} className="p-4 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <strong className="text-sm font-bold text-[#111827]">
                          {svc.name}
                        </strong>
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                            svc.isActive
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {svc.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      {svc.description && <p className="text-[#64748B]">{svc.description}</p>}
                      <div className="flex items-center justify-between pt-1 font-semibold">
                        <span className="text-[#111827]">₹{svc.price}</span>
                        <span className="text-[#2563EB]">~{svc.duration} mins</span>
                      </div>
                      <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#E2E8F0]">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(svc)}
                          className="text-xs text-[#2563EB] hover:underline font-semibold"
                        >
                          Edit Details
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(svc)}
                          className={`text-xs font-semibold hover:underline ${
                            svc.isActive ? "text-slate-500" : "text-emerald-600"
                          }`}
                        >
                          {svc.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Add / Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <h2 className="text-base font-bold text-[#111827]">
                {editingServiceId ? "Edit Service" : "Add New Service"}
              </h2>
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1">
                  Service Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="e.g. Master Haircut & Styling"
                  required
                  disabled={submitting}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={2}
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Details of what this service includes..."
                  disabled={submitting}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    placeholder="e.g. 350"
                    required
                    disabled={submitting}
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1">
                    Duration (Minutes) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    name="duration"
                    value={formData.duration}
                    onChange={handleFormChange}
                    placeholder="e.g. 30"
                    required
                    disabled={submitting}
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleFormChange}
                  disabled={submitting}
                  className="h-4 w-4 rounded border-[#E2E8F0] text-[#2563EB] focus:ring-[#2563EB]"
                />
                <label htmlFor="isActiveToggle" className="text-xs text-[#111827] font-medium cursor-pointer">
                  Active (Accepting bookings &amp; queue entries)
                </label>
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={submitting}
                  className="px-3.5 py-2 border border-[#E2E8F0] text-[#64748B] hover:bg-slate-50 font-semibold rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg text-xs shadow-2xs"
                >
                  {submitting ? "Saving..." : editingServiceId ? "Update Service" : "Create Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Services;
