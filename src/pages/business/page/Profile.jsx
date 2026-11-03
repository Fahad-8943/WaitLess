import BusinessNav from "../components/BusinessNav";

function Profile() {
  const profile = {
    businessName: "Crown & Blade Studio",
    category: "Barbers & Salons",
    description:
      "Premier local grooming studio offering master haircutting, beard grooming, and hot towel treatments with transparent real-time wait times.",
    contact: {
      email: "contact@crownandblade.com",
      phone: "+1 (555) 321-7654",
    },
    address: "428 Market St, Suite 102",
    location: "Downtown Metro",
    operatingHours: [
      { day: "Monday – Friday", hours: "9:00 AM – 8:00 PM" },
      { day: "Saturday", hours: "9:00 AM – 6:00 PM" },
      { day: "Sunday", hours: "Closed" },
    ],
    photos: [
      "Front Entrance & Reception",
      "Main Barber Stations",
      "Customer Lounge",
      "Private Grooming Suite",
    ],
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans">
      <BusinessNav />

      <main className="flex-grow py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827]">
                Business Profile
              </h1>
              <p className="mt-0.5 text-xs sm:text-sm text-[#64748B]">
                Public venue profile, location, operating hours, and gallery.
              </p>
            </div>
            <button
              type="button"
              className="px-3.5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-2xs"
            >
              Save Profile
            </button>
          </div>

          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs p-6 space-y-6 text-xs">
            {/* Header Identity */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
              <div>
                <h2 className="text-lg font-bold text-[#111827]">
                  {profile.businessName}
                </h2>
                <span className="text-[11px] font-semibold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded mt-1 inline-block border border-[#BFDBFE]">
                  {profile.category}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">
                Business Description
              </label>
              <textarea
                rows={3}
                defaultValue={profile.description}
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB] resize-none"
              />
            </div>

            {/* Contact & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E2E8F0]">
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  defaultValue={profile.contact.email}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  defaultValue={profile.contact.phone}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  defaultValue={profile.address}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">
                  City / Area
                </label>
                <input
                  type="text"
                  defaultValue={profile.location}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            {/* Operating Hours */}
            <div className="pt-4 border-t border-[#E2E8F0]">
              <span className="block text-[11px] font-semibold text-[#64748B] uppercase mb-2">
                Operating Schedule
              </span>
              <div className="divide-y divide-[#E2E8F0] border border-[#E2E8F0] rounded-lg">
                {profile.operatingHours.map((item) => (
                  <div
                    key={item.day}
                    className="p-3 flex items-center justify-between"
                  >
                    <strong className="text-[#111827]">{item.day}</strong>
                    <span className="text-[#64748B] font-medium">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Photos Slots */}
            <div className="pt-4 border-t border-[#E2E8F0]">
              <span className="block text-[11px] font-semibold text-[#64748B] uppercase mb-2">
                Venue Photo Slots ({profile.photos.length})
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {profile.photos.map((photo) => (
                  <div
                    key={photo}
                    className="h-20 rounded-lg border border-[#E2E8F0] bg-slate-50 flex items-center justify-center p-2 text-center text-[11px] font-medium text-[#64748B]"
                  >
                    {photo}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
