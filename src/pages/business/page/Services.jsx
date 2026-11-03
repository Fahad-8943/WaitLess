import BusinessNav from "../components/BusinessNav";

function Services() {
  const servicesList = [
    {
      id: 1,
      name: "Haircut",
      description: "Precision haircut with custom styling, neckline trim, and neck shave.",
      price: "₹300",
      duration: "30 min",
      status: "Active",
    },
    {
      id: 2,
      name: "Beard Trim",
      description: "Beard shaping, clean line definition, and nourishing beard oil.",
      price: "₹150",
      duration: "15 min",
      status: "Active",
    },
    {
      id: 3,
      name: "Hot Towel Shave",
      description: "Straight razor hot towel lather shave with post-shave balm.",
      price: "₹400",
      duration: "25 min",
      status: "Active",
    },
    {
      id: 4,
      name: "Deluxe Hair & Beard Package",
      description: "Haircut, beard sculpting, hot towel treatment, and wash.",
      price: "₹800",
      duration: "50 min",
      status: "Active",
    },
    {
      id: 5,
      name: "Hair Wash & Styling",
      description: "Scalp massage wash, blow dry, and matte finish styling.",
      price: "₹250",
      duration: "20 min",
      status: "Active",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans">
      <BusinessNav />

      <main className="flex-grow py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827]">
                Service Menu
              </h1>
              <p className="mt-0.5 text-xs sm:text-sm text-[#64748B]">
                Configure services, set prices, and specify average service durations.
              </p>
            </div>

            <div>
              <button
                type="button"
                className="px-3.5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-2xs"
              >
                + Add Service
              </button>
            </div>
          </div>

          {/* Desktop Table & Mobile Cards */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between text-xs">
              <span className="font-semibold text-[#111827]">
                Active Offerings ({servicesList.length})
              </span>
              <span className="text-[#64748B]">Used for queue &amp; booking estimation</span>
            </div>

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
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {servicesList.map((svc) => (
                    <tr key={svc.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#111827]">
                        {svc.name}
                      </td>
                      <td className="py-3.5 px-4 text-[#64748B] max-w-sm">
                        {svc.description}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#111827]">
                        {svc.price}
                      </td>
                      <td className="py-3.5 px-4 text-[#2563EB] font-semibold">
                        ~{svc.duration}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {svc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-[#E2E8F0]">
              {servicesList.map((svc) => (
                <div key={svc.id} className="p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <strong className="text-sm font-bold text-[#111827]">
                      {svc.name}
                    </strong>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {svc.status}
                    </span>
                  </div>
                  <p className="text-[#64748B]">{svc.description}</p>
                  <div className="flex items-center justify-between pt-1 font-semibold">
                    <span className="text-[#111827]">{svc.price}</span>
                    <span className="text-[#2563EB]">~{svc.duration}</span>
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

export default Services;
