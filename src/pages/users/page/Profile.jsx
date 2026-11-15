import { useState, useEffect } from "react";
import UserNav from "../components/UserNav";
import { useAuth } from "../../../context/useAuth";
import { authApi } from "../../../api/auth";

function Profile() {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchProfile() {
      try {
        const res = await authApi.getMe();
        if (isMounted && res?.data?.user) {
          const u = res.data.user;
          setFormData({
            name: u.name || "",
            email: u.email || "",
            phone: u.phone || "",
          });
          updateUser(u);
        }
      } catch (err) {
        if (isMounted) {
          if (user) {
            setFormData({
              name: user.name || "",
              email: user.email || "",
              phone: user.phone || "",
            });
          }
          setErrorMessage(err.message || "Failed to load profile details.");
        }
      } finally {
        if (isMounted) {
          setFetching(false);
        }
      }
    }

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [updateUser, user]);

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
      setErrorMessage("Full Name must be at least 2 characters long.");
      return;
    }

    if (formData.phone && !/^[+]?[0-9\s-]{7,20}$/.test(formData.phone.trim())) {
      setErrorMessage("Please enter a valid phone number (7-20 digits).");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim() || null,
      };

      const res = await authApi.updateProfile(payload);
      if (res?.data?.user) {
        updateUser(res.data.user);
        setFormData((prev) => ({
          ...prev,
          name: res.data.user.name || "",
          phone: res.data.user.phone || "",
        }));
      }
      setSuccessMessage("Profile updated successfully.");
    } catch (err) {
      setErrorMessage(err.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const displayName = formData.name || user?.name || "Customer";
  const displayEmail = formData.email || user?.email || "No email registered";
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recent";
  const accountStatus = user?.isActive ? "Active" : "Active";

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans">
      <UserNav />

      <main className="flex-grow py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827]">
              Customer Profile
            </h1>
            <p className="mt-0.5 text-xs sm:text-sm text-[#64748B]">
              Manage your personal information and contact details.
            </p>
          </div>

          {successMessage && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center justify-between">
              <span>{successMessage}</span>
              <button
                type="button"
                onClick={() => setSuccessMessage("")}
                className="text-emerald-600 hover:text-emerald-800 font-bold ml-2"
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
                className="text-rose-600 hover:text-rose-800 font-bold ml-2"
              >
                ✕
              </button>
            </div>
          )}

          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs p-6 space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-[#E2E8F0]">
              <div className="h-12 w-12 rounded-full bg-[#3730A3] text-white flex items-center justify-center font-bold text-lg">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-base font-bold text-[#111827]">
                  {displayName}
                </h2>
                <span className="text-xs text-[#64748B]">
                  Member since {memberSince} • Account {accountStatus}
                </span>
              </div>
            </div>

            {fetching ? (
              <div className="py-8 text-center text-xs text-[#64748B]">
                Loading profile details...
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label
                      htmlFor="profile-name"
                      className="block text-xs font-semibold text-[#64748B] uppercase mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      id="profile-name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="profile-email"
                      className="block text-xs font-semibold text-[#64748B] uppercase mb-1"
                    >
                      Email Address (Read-only)
                    </label>
                    <input
                      id="profile-email"
                      name="email"
                      type="email"
                      value={displayEmail}
                      disabled
                      readOnly
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-slate-100 text-slate-500 text-xs cursor-not-allowed"
                    />
                    <p className="mt-1 text-[11px] text-[#94A3B8]">
                      Account email cannot be modified.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="profile-phone"
                      className="block text-xs font-semibold text-[#64748B] uppercase mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      id="profile-phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1234567890"
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="profile-role"
                      className="block text-xs font-semibold text-[#64748B] uppercase mb-1"
                    >
                      Account Role
                    </label>
                    <input
                      id="profile-role"
                      type="text"
                      value={user?.role ? user.role.toUpperCase() : "CUSTOMER"}
                      disabled
                      readOnly
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-slate-100 text-slate-500 text-xs cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                  <span className="text-xs text-[#64748B]">
                    Changes are saved to your customer account.
                  </span>
                  <button
                    type="submit"
                    disabled={loading}
                    className="min-h-[44px] flex items-center justify-center px-4 py-2 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors shadow-2xs"
                  >
                    {loading ? "Saving..." : "Save Profile"}
                  </button>
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
