import { useState, useEffect } from "react";
import BusinessNav from "../components/BusinessNav";
import BusinessSwitcher from "../components/BusinessSwitcher";
import { useProviderBusiness } from "../hooks/useProviderBusiness";
import { providerApi } from "../../../api/auth";

function Profile() {
  const {
    businesses,
    selectedBusinessId,
    selectedBusiness,
    setSelectedBusinessId,
    loading: loadingBusinesses,
    isPending,
    isSuspended,
    isInactive,
    refreshBusinesses,
  } = useProviderBusiness();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function load() {
      if (!selectedBusinessId) {
        setLoadingProfile(false);
        return;
      }

      try {
        setErrorMessage("");
        const res = await providerApi.getBusinessProfile(selectedBusinessId);
        if (isMounted && res?.data?.business) {
          const b = res.data.business;
          setFormData({
            name: b.name || "",
            category: b.category || "",
            description: b.description || "",
            email: b.contact?.email || "",
            phone: b.contact?.phone || "",
            street: b.address?.street || "",
            city: b.address?.city || "",
            state: b.address?.state || "",
            postalCode: b.address?.postalCode || "",
          });
        }
      } catch (err) {
        if (isMounted) {
          setErrorMessage(err.message || "Failed to load venue profile.");
        }
      } finally {
        if (isMounted) {
          setLoadingProfile(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [selectedBusinessId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setErrorMessage("Business name must be at least 2 characters long.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim() || "",
        contact: {
          email: formData.email.trim() || null,
          phone: formData.phone.trim() || null,
        },
        address: {
          street: formData.street.trim() || "Address not specified",
          city: formData.city.trim() || "City",
          state: formData.state.trim() || "State",
          postalCode: formData.postalCode.trim() || "000000",
        },
      };

      await providerApi.updateBusinessProfile(selectedBusinessId, payload);
      setSuccessMessage("Business profile updated successfully.");
      refreshBusinesses();
    } catch (err) {
      setErrorMessage(err.message || "Failed to save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans">
      <BusinessNav />

      <main className="flex-grow py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
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
                Business Profile
              </h1>
              <p className="mt-0.5 text-xs sm:text-sm text-[#64748B]">
                Public venue profile, address, contact information, and operating details.
              </p>
            </div>
            <button
              type="submit"
              form="business-profile-form"
              disabled={saving || !selectedBusinessId}
              className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors shadow-2xs cursor-pointer disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
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

          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs p-6 space-y-6 text-xs">
            {loadingBusinesses || loadingProfile ? (
              <div className="py-12 text-center text-xs text-[#64748B] space-y-2">
                <div className="inline-block h-6 w-6 rounded-full border-2 border-[#2563EB] border-t-transparent animate-spin" />
                <p>Loading profile details...</p>
              </div>
            ) : !selectedBusinessId ? (
              <div className="py-8 text-center text-xs text-[#64748B]">
                No business venue selected.
              </div>
            ) : (
              <form id="business-profile-form" onSubmit={handleSubmit} className="space-y-6">
                {/* Header Identity */}
                <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                  <div>
                    <h2 className="text-lg font-bold text-[#111827]">
                      {formData.name || "Business Venue"}
                    </h2>
                    <span className="text-[11px] font-semibold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded mt-1 inline-block border border-[#BFDBFE]">
                      {formData.category || "Category"}
                    </span>
                  </div>
                </div>

                <div>
                  <label htmlFor="venue-name" className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">
                    Business Name *
                  </label>
                  <input
                    id="venue-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="venue-desc" className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">
                    Business Description
                  </label>
                  <textarea
                    id="venue-desc"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB] resize-none"
                  />
                </div>

                {/* Contact & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E2E8F0]">
                  <div>
                    <label htmlFor="venue-email" className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">
                      Contact Email
                    </label>
                    <input
                      id="venue-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="venue@business.com"
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label htmlFor="venue-phone" className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">
                      Contact Phone
                    </label>
                    <input
                      id="venue-phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label htmlFor="venue-street" className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">
                      Street Address
                    </label>
                    <input
                      id="venue-street"
                      name="street"
                      type="text"
                      value={formData.street}
                      onChange={handleChange}
                      placeholder="123 High St"
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label htmlFor="venue-city" className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">
                      City
                    </label>
                    <input
                      id="venue-city"
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Bangalore"
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label htmlFor="venue-state" className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">
                      State
                    </label>
                    <input
                      id="venue-state"
                      name="state"
                      type="text"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="e.g. Karnataka"
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label htmlFor="venue-postal" className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">
                      Postal Code
                    </label>
                    <input
                      id="venue-postal"
                      name="postalCode"
                      type="text"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="e.g. 560001"
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
