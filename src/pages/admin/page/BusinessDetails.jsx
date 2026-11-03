import { Link } from "react-router";
import AdminNav from "../components/AdminNav";

function BusinessDetails() {
  const business = {
    name: "Metro Smile Dental",
    category: "Clinics",
    description: "Local dental clinic offering routine oral checkups, dental cleanings, and specialized orthodontic consultations.",
    currentStatus: "Pending Application",
    owner: {
      name: "Dr. David Cho",
      email: "david.cho@metrosmile.com",
      phone: "+1 (555) 432-8765",
    },
    location: "104 Westside Medical Plaza, Suite 2B, Westside Metro",
    operatingHours: [
      { day: "Monday – Friday", hours: "8:30 AM – 5:30 PM" },
      { day: "Saturday", hours: "9:00 AM – 2:00 PM" },
      { day: "Sunday", hours: "Closed" },
    ],
    services: [
      { name: "General Dental Checkup", price: "₹500", duration: "30 min" },
      { name: "Teeth Cleaning & Polish", price: "₹800", duration: "45 min" },
      { name: "Initial Consultation", price: "₹300", duration: "20 min" },
    ],
    photos: [
      "Clinic Reception Desk",
      "Examination Room 1",
      "Sterilization Bay",
    ],
  };

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
            <span className="text-[#111827]">{business.name}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827]">
                Business Application: {business.name}
              </h1>
              <p className="mt-0.5 text-xs sm:text-sm text-[#64748B]">
                Review business application details and service catalog.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-2xs"
              >
                Approve Business
              </button>
              <button
                type="button"
                className="px-3.5 py-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 font-semibold text-xs rounded-lg transition-colors"
              >
                Reject Business
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs p-6 space-y-6 text-xs">
            {/* Header Identity & Status */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
              <div>
                <h2 className="text-lg font-bold text-[#111827]">
                  {business.name}
                </h2>
                <span className="text-[11px] font-semibold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded mt-1 inline-block border border-[#BFDBFE]">
                  Category: {business.category}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                Status: {business.currentStatus}
              </span>
            </div>

            {/* Business Description */}
            <div>
              <span className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">
                Business Description
              </span>
              <p className="text-xs text-[#111827] leading-relaxed">
                {business.description}
              </p>
            </div>

            {/* Owner Information & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E2E8F0]">
              <div className="space-y-1">
                <span className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">
                  Owner Details
                </span>
                <p className="text-[#111827]">Name: <strong>{business.owner.name}</strong></p>
                <p className="text-[#111827]">Email: {business.owner.email}</p>
                <p className="text-[#111827]">Phone: {business.owner.phone}</p>
              </div>

              <div className="space-y-1">
                <span className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">
                  Address &amp; Location
                </span>
                <p className="text-[#111827] leading-relaxed">{business.location}</p>
              </div>
            </div>

            {/* Services Offered */}
            <div className="pt-4 border-t border-[#E2E8F0] space-y-2">
              <span className="block text-[11px] font-semibold text-[#64748B] uppercase">
                Submitted Services &amp; Durations ({business.services.length})
              </span>
              <div className="divide-y divide-[#E2E8F0] border border-[#E2E8F0] rounded-lg">
                {business.services.map((svc) => (
                  <div key={svc.name} className="p-3 flex items-center justify-between">
                    <div>
                      <strong className="text-[#111827] block">{svc.name}</strong>
                      <span className="text-[#64748B] text-[11px]">Duration: ~{svc.duration}</span>
                    </div>
                    <strong className="text-[#111827]">{svc.price}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Operating Hours */}
            <div className="pt-4 border-t border-[#E2E8F0] space-y-2">
              <span className="block text-[11px] font-semibold text-[#64748B] uppercase">
                Operating Schedule
              </span>
              <div className="divide-y divide-[#E2E8F0] border border-[#E2E8F0] rounded-lg">
                {business.operatingHours.map((h) => (
                  <div key={h.day} className="p-2.5 flex items-center justify-between">
                    <span className="text-[#111827] font-medium">{h.day}</span>
                    <span className="text-[#64748B]">{h.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Photos */}
            <div className="pt-4 border-t border-[#E2E8F0] space-y-2">
              <span className="block text-[11px] font-semibold text-[#64748B] uppercase">
                Submitted Photos ({business.photos.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {business.photos.map((photo) => (
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

export default BusinessDetails;
