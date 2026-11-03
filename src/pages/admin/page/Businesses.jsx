import { Link } from "react-router";
import AdminNav from "../components/AdminNav";

function Businesses() {
  const businessesList = [
    {
      id: "metro-smile",
      business: "Metro Smile Dental",
      owner: "Dr. David Cho",
      category: "Clinics",
      location: "Westside Metro",
      status: "Pending Application",
      rating: "—",
      registrationDate: "Today, Oct 4, 2026",
    },
    {
      id: "velocity-auto",
      business: "Velocity Auto Care",
      owner: "Carl Jenkins",
      category: "Repair",
      location: "Industrial District",
      status: "Pending Application",
      rating: "—",
      registrationDate: "Oct 3, 2026",
    },
    {
      id: "crown-blade",
      business: "Crown & Blade Studio",
      owner: "Elena Vance",
      category: "Barbers",
      location: "Downtown Metro",
      status: "Active",
      rating: "4.9",
      registrationDate: "Jan 12, 2026",
    },
    {
      id: "laura-salon",
      business: "L'Aura Hair & Beauty",
      owner: "Laura Rossi",
      category: "Salons",
      location: "Midtown",
      status: "Active",
      rating: "4.9",
      registrationDate: "Feb 18, 2026",
    },
    {
      id: "green-fork",
      business: "The Green Fork Bistro",
      owner: "Marcus Green",
      category: "Restaurants",
      location: "Waterfront",
      status: "Active",
      rating: "4.6",
      registrationDate: "Mar 05, 2026",
    },
  ];

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

            {/* Filter Buttons UI (Visual only) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border bg-[#111827] text-white border-[#111827]"
              >
                All (5)
              </button>
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border bg-white text-amber-800 border-amber-200 hover:bg-amber-50"
              >
                Pending Applications (2)
              </button>
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50"
              >
                Active (3)
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
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
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4">Registered</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {businessesList.map((biz) => (
                    <tr key={biz.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#111827]">
                        {biz.business}
                      </td>
                      <td className="py-3.5 px-4 text-[#64748B]">
                        {biz.owner}
                      </td>
                      <td className="py-3.5 px-4 text-[#64748B]">
                        {biz.category}
                      </td>
                      <td className="py-3.5 px-4 text-[#64748B]">
                        {biz.location}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                            biz.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}
                        >
                          {biz.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#111827]">
                        {biz.rating !== "—" ? `★ ${biz.rating}` : "—"}
                      </td>
                      <td className="py-3.5 px-4 text-[#64748B] text-[11px]">
                        {biz.registrationDate}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5">
                        <Link
                          to={`/admin/businesses/${biz.id}`}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[#111827] font-semibold text-[11px] transition-colors"
                        >
                          Review Business
                        </Link>
                        {biz.status === "Pending Application" && (
                          <>
                            <button
                              type="button"
                              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              className="px-2.5 py-1 rounded bg-white hover:bg-red-50 text-red-600 border border-red-200 font-semibold text-[11px] transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="lg:hidden divide-y divide-[#E2E8F0]">
              {businessesList.map((biz) => (
                <div key={biz.id} className="p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <strong className="text-sm font-bold text-[#111827]">
                      {biz.business}
                    </strong>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                        biz.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}
                    >
                      {biz.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-[#64748B] space-y-0.5">
                    <div>Owner: <strong className="text-[#111827]">{biz.owner}</strong> &bull; {biz.category}</div>
                    <div>Location: {biz.location}</div>
                    <div>Registered: {biz.registrationDate} &bull; Rating: {biz.rating}</div>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <Link
                      to={`/admin/businesses/${biz.id}`}
                      className="px-3 py-1.5 rounded bg-slate-100 text-[#111827] font-semibold text-xs"
                    >
                      Review Business
                    </Link>
                    {biz.status === "Pending Application" && (
                      <>
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded bg-emerald-600 text-white font-semibold text-xs"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded bg-white text-red-600 border border-red-200 font-semibold text-xs"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Businesses;
