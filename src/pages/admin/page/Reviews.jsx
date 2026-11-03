import AdminNav from "../components/AdminNav";

function Reviews() {
  const reviewsList = [
    {
      id: 1,
      user: "Marcus Vance",
      business: "Crown & Blade Studio",
      rating: "5",
      review: "Clean haircut and beard trim. Knowing the exact queue wait time made the visit effortless.",
      date: "Oct 2, 2026",
      status: "Published",
    },
    {
      id: 2,
      user: "Sarah Jenkins",
      business: "Crown & Blade Studio",
      rating: "5",
      review: "Very professional venue, friendly staff, and the service was completed right on schedule.",
      date: "Sep 28, 2026",
      status: "Published",
    },
    {
      id: 3,
      user: "David Lee",
      business: "The Green Fork Bistro",
      rating: "4",
      review: "Smooth table waitlist experience. Food was fresh and staff was accommodating.",
      date: "Sep 20, 2026",
      status: "Published",
    },
    {
      id: 4,
      user: "Customer User",
      business: "Precision Auto Care",
      rating: "2",
      review: "Wait time was slightly longer than estimated during peak afternoon rush.",
      date: "Sep 15, 2026",
      status: "Under Review",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans">
      <AdminNav />

      <main className="flex-grow py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827]">
                Review Moderation
              </h1>
              <p className="mt-0.5 text-xs sm:text-sm text-[#64748B]">
                Audit customer reviews and compliance reports across registered venues.
              </p>
            </div>
            <span className="text-xs text-[#64748B]">
              Total Reviews: <strong>{reviewsList.length}</strong>
            </span>
          </div>

          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs divide-y divide-[#E2E8F0] overflow-hidden">
            {reviewsList.map((rev) => (
              <div key={rev.id} className="p-4 space-y-2 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <strong className="text-[#111827] text-sm">{rev.user}</strong>
                    <span className="text-[#64748B] ml-2">
                      for <strong className="text-[#111827]">{rev.business}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[#64748B] text-[11px]">{rev.date}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                        rev.status === "Published"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}
                    >
                      {rev.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center text-amber-500 font-semibold text-xs">
                  {"★".repeat(Number(rev.rating))}
                  <span className="ml-1 text-[11px] text-[#64748B]">
                    ({rev.rating} of 5)
                  </span>
                </div>

                <p className="text-[#64748B] leading-relaxed">
                  {rev.review}
                </p>

                {rev.status === "Under Review" && (
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] transition-colors"
                    >
                      Approve &amp; Publish
                    </button>
                    <button
                      type="button"
                      className="px-2.5 py-1 rounded bg-white hover:bg-red-50 text-red-600 border border-red-200 font-semibold text-[11px] transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Reviews;
