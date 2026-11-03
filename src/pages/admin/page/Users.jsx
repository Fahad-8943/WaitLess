import AdminNav from "../components/AdminNav";

function Users() {
  const usersList = [
    {
      id: 1,
      name: "Marcus Vance",
      email: "marcus.v@example.com",
      phone: "+1 (555) 876-5432",
      registrationDate: "Oct 2, 2026",
      status: "Active",
    },
    {
      id: 2,
      name: "Sarah Jenkins",
      email: "sarah.j@example.com",
      phone: "+1 (555) 456-7890",
      registrationDate: "Sep 28, 2026",
      status: "Active",
    },
    {
      id: 3,
      name: "David Lee",
      email: "david.lee@example.com",
      phone: "+1 (555) 987-6543",
      registrationDate: "Sep 18, 2026",
      status: "Active",
    },
    {
      id: 4,
      name: "Priya Sharma",
      email: "priya.s@example.com",
      phone: "+1 (555) 345-6789",
      registrationDate: "Today, Oct 4, 2026",
      status: "Active",
    },
    {
      id: 5,
      name: "Rohan Mehta",
      email: "rohan.m@example.com",
      phone: "+1 (555) 654-3210",
      registrationDate: "Sep 10, 2026",
      status: "Active",
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
                Customer Accounts
              </h1>
              <p className="mt-0.5 text-xs sm:text-sm text-[#64748B]">
                Directory of registered customer users on the WaitLess platform.
              </p>
            </div>
            <span className="text-xs text-[#64748B]">
              Registered Customers: <strong>{usersList.length}</strong>
            </span>
          </div>

          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Registration Date</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {usersList.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#111827]">
                        {user.name}
                      </td>
                      <td className="py-3.5 px-4 text-[#64748B]">
                        {user.email}
                      </td>
                      <td className="py-3.5 px-4 text-[#64748B]">
                        {user.phone}
                      </td>
                      <td className="py-3.5 px-4 text-[#111827]">
                        {user.registrationDate}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-[#E2E8F0]">
              {usersList.map((user) => (
                <div key={user.id} className="p-4 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <strong className="text-sm font-bold text-[#111827]">
                      {user.name}
                    </strong>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {user.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#64748B] space-y-0.5">
                    <div>Email: <span className="text-[#111827]">{user.email}</span></div>
                    <div>Phone: {user.phone} &bull; Registered: {user.registrationDate}</div>
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

export default Users;
