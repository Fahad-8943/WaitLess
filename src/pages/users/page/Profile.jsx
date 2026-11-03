import UserNav from "../components/UserNav";

function Profile() {
  const userProfile = {
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    phone: "+1 (555) 234-5678",
    memberSince: "January 2026",
    location: "Downtown Metro",
    accountStatus: "Active",
  };

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

          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs p-6 space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-[#E2E8F0]">
              <div className="h-12 w-12 rounded-full bg-[#3730A3] text-white flex items-center justify-center font-bold text-lg">
                {userProfile.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-base font-bold text-[#111827]">
                  {userProfile.name}
                </h2>
                <span className="text-xs text-[#64748B]">
                  Member since {userProfile.memberSince} &bull; Account {userProfile.accountStatus}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue={userProfile.name}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue={userProfile.email}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  defaultValue={userProfile.phone}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">
                  Default Location
                </label>
                <input
                  type="text"
                  defaultValue={userProfile.location}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
              <span className="text-xs text-[#64748B]">
                Changes are saved to your customer session.
              </span>
              <button
                type="button"
                className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-2xs"
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
