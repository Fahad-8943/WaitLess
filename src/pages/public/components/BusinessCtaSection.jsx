import { Link } from "react-router";

function BusinessCtaSection() {
  return (
    <section id="for-businesses" className="py-16 md:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-[#3730A3] rounded-2xl p-8 sm:p-12 text-white max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              For Local Venues
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
              Own a local service business?
            </h2>
            <p className="mt-2 text-sm text-indigo-100 leading-relaxed">
              Register your business to manage service menus, accept scheduled bookings, and run a digital queue from a unified dashboard.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              to="/business-register"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-[#111827] bg-white hover:bg-slate-100 rounded-xl transition-colors shadow-xs"
            >
              Register Your Business
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BusinessCtaSection;
