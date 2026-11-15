import { Link } from "react-router";
import catBarbers from "../../../assets/categories/cat-barbers-salons.webp";
import catClinics from "../../../assets/categories/cat-health-clinics.webp";
import catAuto from "../../../assets/categories/cat-auto-repair.webp";
import catDining from "../../../assets/categories/cat-dining-cafes.webp";
import catBeauty from "../../../assets/categories/cat-beauty-wellness.webp";
import catFitness from "../../../assets/categories/cat-fitness-therapy.webp";

function BusinessCtaSection() {
  // Verified categories directly aligned with BusinessRegister.jsx
  const categories = [
    {
      name: "Barbers & Salons",
      description: "Haircuts, beard styling, and multi-service grooming slots.",
      image: catBarbers,
      alt: "Modern barber and hair styling studio with station mirrors and chairs",
    },
    {
      name: "Health & Clinics",
      description: "Medical consultations, patient check-ins, and relaxed lobby queues.",
      image: catClinics,
      alt: "Modern medical consultation room and healthcare clinic reception",
    },
    {
      name: "Auto Service & Repair",
      description: "Diagnostic bay appointments, maintenance status, and vehicle pickup.",
      image: catAuto,
      alt: "Automotive service bay with technician diagnostic equipment",
    },
    {
      name: "Dining & Cafes",
      description: "Walk-in table queues, barista order pickups, and dining arrivals.",
      image: catDining,
      alt: "Artisan cafe counter with order pickup area",
    },
    {
      name: "Beauty & Wellness",
      description: "Spa treatments, skincare sessions, and scheduled therapy.",
      image: catBeauty,
      alt: "Calm wellness and spa treatment room with natural lighting",
    },
    {
      name: "Fitness & Physical Therapy",
      description: "Rehab appointments, trainer slots, and studio sessions.",
      image: catFitness,
      alt: "Physical therapy and rehabilitation studio room",
    },
  ];

  return (
    <section
      id="for-businesses"
      className="relative bg-[#07090E] py-20 md:py-28 overflow-hidden"
    >
      {/* Ambient Radial Spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-radial from-blue-600/10 via-indigo-600/5 to-transparent blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Verified Service Categories Photographic Gallery */}
        <div>
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
              Supported Sectors
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
              Built for Local Service Venues
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Configured for appointment and walk-in businesses managing multi-service duration workflows and operator grace periods.
            </p>
          </div>

          {/* Photographic 6-Card Category Grid */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to="/discover"
                className="group relative rounded-2xl overflow-hidden border border-slate-800 bg-[#0B0F19] hover:border-slate-700 transition-all duration-300 shadow-xl shadow-black/40 ring-1 ring-white/5 flex flex-col justify-end min-h-[220px] sm:min-h-[240px]"
              >
                {/* Background Category Photograph */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.alt}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter saturate-90"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07090E] via-[#07090E]/60 to-transparent" />
                </div>

                {/* Card Foreground Content */}
                <div className="relative z-10 p-5 sm:p-6 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 block font-semibold">
                    Supported Category
                  </span>
                  <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-blue-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                  <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
                    <span>Explore venues</span>
                    <span aria-hidden="true">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Dual Conversion Action Card */}
        <div className="rounded-3xl border border-slate-800 bg-[#0B0F19] p-8 sm:p-12 shadow-2xl shadow-black/60 relative ring-1 ring-white/5 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Action A: For Venue Owners */}
            <div className="space-y-4 text-center lg:text-left">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-400 block">
                Venue Operator Onboarding
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
                Operate a Walk-In or Booking Venue?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto lg:mx-0">
                Register your business to configure service durations, establish arrival grace periods, and operate an operator queue management desk.
              </p>
              <div className="pt-2">
                <Link
                  to="/business-register"
                  className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl transition-all duration-200 shadow-lg shadow-blue-900/30 border border-blue-400/20 active:scale-[0.98]"
                >
                  Register Your Business
                </Link>
              </div>
            </div>

            {/* Action B: For Service Seekers */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-4 text-center lg:text-left">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 block">
                Customer &amp; Client Access
              </span>
              <h4 className="text-xl font-bold text-white tracking-tight">
                Looking to Book or Join a Queue?
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Discover local providers, check transparent service menus, and secure your place in line before leaving home.
              </p>
              <div className="pt-1">
                <Link
                  to="/discover"
                  className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold text-slate-200 bg-slate-800 hover:bg-slate-750 hover:text-white rounded-xl transition-all duration-200 border border-slate-700 active:scale-[0.98]"
                >
                  Browse Available Services →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BusinessCtaSection;
