function HowItWorksSection() {
  const steps = [
    {
      step: "1",
      title: "Discover Local Services",
      description: "Search nearby salons, barbers, clinics, and service providers. Check current waiting times and service lists before heading out.",
    },
    {
      step: "2",
      title: "Book a Slot or Join Queue",
      description: "Select one or multiple services. Choose to schedule an advance appointment or grab a live digital queue token.",
    },
    {
      step: "3",
      title: "Track & Arrive on Time",
      description: "Watch your token move in real time. Arrive within the designated grace period when your token is called.",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-20 bg-white border-b border-[#E2E8F0]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
            Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] mt-1 tracking-tight">
            How WaitLess Works
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#64748B]">
            Three practical steps designed to replace physical waiting with predictable timing.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((item) => (
            <div
              key={item.title}
              className="p-6 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="h-7 w-7 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs">
                  {item.step}
                </span>
                <h3 className="text-base font-bold text-[#111827]">
                  {item.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
