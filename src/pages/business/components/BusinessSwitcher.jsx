import { Link } from "react-router";

export default function BusinessSwitcher({
  businesses = [],
  selectedBusinessId = "",
  onSelectBusiness = () => {},
  selectedBusiness = null,
  isPending = false,
  isSuspended = false,
  isInactive = false,
}) {
  if (businesses.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
        <div>
          <strong className="block font-bold">No registered businesses found</strong>
          <span>Register a venue to begin managing bookings, services, and live queues.</span>
        </div>
        <Link
          to="/business/register"
          className="inline-flex items-center justify-center px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition-colors shadow-2xs whitespace-nowrap"
        >
          Register Business
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Venue Switcher Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="text-[#64748B] font-semibold uppercase text-[11px] tracking-wider">
            Active Venue:
          </span>
          {businesses.length > 1 ? (
            <select
              value={selectedBusinessId}
              onChange={(e) => onSelectBusiness(e.target.value)}
              className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-1.5 font-bold text-[#111827] text-xs focus:outline-none focus:border-[#2563EB] cursor-pointer"
            >
              {businesses.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name} ({b.address?.city || "Local"}) — {b.approvalStatus.toUpperCase()}
                </option>
              ))}
            </select>
          ) : (
            <strong className="font-bold text-[#111827] text-sm">
              {selectedBusiness?.name || "Business Venue"}
            </strong>
          )}
        </div>

        <div className="flex items-center gap-2">
          {selectedBusiness && (
            <span
              className={`px-2.5 py-0.5 rounded text-[11px] font-semibold capitalize border ${
                selectedBusiness.approvalStatus === "approved"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : selectedBusiness.approvalStatus === "pending"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-rose-50 text-rose-700 border-rose-200"
              }`}
            >
              Approval: {selectedBusiness.approvalStatus}
            </span>
          )}

          {selectedBusiness && (
            <span
              className={`px-2.5 py-0.5 rounded text-[11px] font-semibold border ${
                selectedBusiness.isActive
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-slate-100 text-slate-600 border-slate-200"
              }`}
            >
              {selectedBusiness.isActive ? "Active" : "Deactivated"}
            </span>
          )}

          <Link
            to="/business/register"
            className="text-[11px] font-semibold text-[#2563EB] hover:underline ml-2"
          >
            + Register Another Venue
          </Link>
        </div>
      </div>

      {/* Warning Banners for Inactive / Pending / Suspended states */}
      {isPending && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between">
          <span>
            ⚠️ <strong>Pending Approval:</strong> This venue is awaiting platform administrator approval. Customers cannot discover or book appointments until approved.
          </span>
        </div>
      )}

      {isSuspended && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center justify-between">
          <span>
            🛑 <strong>Venue Suspended:</strong> This business has been suspended by platform administration.
          </span>
        </div>
      )}

      {isInactive && (
        <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700 flex items-center justify-between">
          <span>
            ⏸️ <strong>Venue Deactivated:</strong> This venue is marked inactive.
          </span>
        </div>
      )}
    </div>
  );
}
