function WhyWaitlessSection() {
  const features = [
    {
      title: "Discover Nearby",
      description: "Search local barbers, salons, clinics, and repair centers by category, location, and distance.",
    },
    {
      title: "Multiple Service Selection",
      description: "Pick multiple services in a single booking or queue token with combined time duration calculated upfront.",
    },
    {
      title: "Live Queue Visibility",
      description: "See exactly which token is being served, how many people are ahead, and estimated wait duration.",
    },
    {
      title: "Grace Period Handling",
      description: "A built-in arrival window gives customers reasonable time to step in when their token is called.",
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-[#F8FAFC] border-b border-[#E2E8F0]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-[#3730A3]">
            Key Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] mt-1 tracking-tight">
            Why WaitLess
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#64748B]">
            Designed for local walk-in services where physical lines and uncertain waits create friction.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div
              key={feature.title}
              className="p-5 rounded-xl border border-[#E2E8F0] bg-white shadow-2xs"
            >
              <span className="text-xs font-bold text-[#2563EB]">0{idx + 1}</span>
              <h3 className="text-sm sm:text-base font-bold text-[#111827] mt-2">
                {feature.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#64748B] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyWaitlessSection;
