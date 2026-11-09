import BusinessNav from "../components/BusinessNav";

function Reviews() {
  const reviewsList = [
    {
      id: 1,
      customer: "Marcus Vance",
      rating: "5",
      review:
        "Outstanding haircut and beard trim. Knowing the exact queue wait time ahead of arriving made the visit completely stress-free.",
      date: "Oct 2, 2026",
    },
    {
      id: 2,
      customer: "Sarah Jenkins",
      rating: "5",
      review:
        "The studio is clean, staff is welcoming, and the service was completed right on schedule.",
      date: "Sep 28, 2026",
    },
    {
      id: 3,
      customer: "David Lee",
      rating: "4",
      review:
        "Great beard trim and hot towel service. Very smooth experience overall.",
      date: "Sep 20, 2026",
    },
    {
      id: 4,
      customer: "Rohan Mehta",
      rating: "5",
      review:
        "Best local grooming experience. The deluxe package is well worth the time.",
      date: "Sep 14, 2026",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans">
      <BusinessNav />

      <main className="flex-grow py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827]">
                Customer Reviews
              </h1>
              <p className="mt-0.5 text-xs sm:text-sm text-[#64748B]">
                Customer ratings and reviews for your venue.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
              <span className="font-bold text-amber-600">★ 4.9 Average</span>
              <span>•</span>
              <span>{reviewsList.length} reviews</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs divide-y divide-[#E2E8F0] overflow-hidden">
            {reviewsList.map((rev) => (
              <div key={rev.id} className="p-4 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <strong className="text-sm font-bold text-[#111827]">
                    {rev.customer}
                  </strong>
                  <span className="text-[#64748B] text-[11px]">{rev.date}</span>
                </div>

                <div className="flex items-center text-amber-500 font-semibold text-xs">
                  {"★".repeat(Number(rev.rating))}
                  <span className="ml-1 text-[11px] text-[#64748B]">
                    ({rev.rating} of 5)
                  </span>
                </div>

                <p className="text-[#64748B] leading-relaxed pt-1">
                  {rev.review}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Reviews;
