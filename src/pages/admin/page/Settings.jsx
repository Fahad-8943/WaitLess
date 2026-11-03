import AdminNav from "../components/AdminNav";

function Settings() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans">
      <AdminNav />

      <main className="flex-grow py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827]">
              Platform Configuration
            </h1>
            <p className="mt-0.5 text-xs sm:text-sm text-[#64748B]">
              Global system preferences, queue grace period timing, and operational status.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs p-6 space-y-5 text-xs">
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label
                  htmlFor="platform-name"
                  className="block text-xs font-semibold text-[#111827] mb-1"
                >
                  Platform Name
                </label>
                <input
                  type="text"
                  id="platform-name"
                  name="platform-name"
                  defaultValue="WaitLess"
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label
                  htmlFor="support-email"
                  className="block text-xs font-semibold text-[#111827] mb-1"
                >
                  Support Contact Email
                </label>
                <input
                  type="email"
                  id="support-email"
                  name="support-email"
                  defaultValue="support@waitless.com"
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label
                  htmlFor="default-timezone"
                  className="block text-xs font-semibold text-[#111827] mb-1"
                >
                  Default System Timezone
                </label>
                <input
                  type="text"
                  id="default-timezone"
                  name="default-timezone"
                  defaultValue="America/New_York (UTC-5)"
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label
                  htmlFor="grace-period"
                  className="block text-xs font-semibold text-[#111827] mb-1"
                >
                  Default Queue Grace Period
                </label>
                <input
                  type="text"
                  id="grace-period"
                  name="grace-period"
                  defaultValue="10 minutes"
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB]"
                />
                <span className="text-[11px] text-[#64748B] mt-0.5 block">
                  Time allocated for a customer to arrive once their token is called before skipping.
                </span>
              </div>

              <div>
                <label
                  htmlFor="platform-status"
                  className="block text-xs font-semibold text-[#111827] mb-1"
                >
                  Platform Operational Status
                </label>
                <select
                  id="platform-status"
                  name="platform-status"
                  defaultValue="Operational"
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="Operational">Operational (Live)</option>
                  <option value="Maintenance">Maintenance Mode</option>
                </select>
              </div>

              <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                <span className="text-[11px] text-[#64748B]">
                  Applied system-wide across all customer and business portals.
                </span>
                <button
                  type="button"
                  className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-2xs"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Settings;
