import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import HowItWorksSection from "../components/HowItWorksSection";
import WhyWaitlessSection from "../components/WhyWaitlessSection";
import BusinessCtaSection from "../components/BusinessCtaSection";
import Footer from "../components/Footer";

function Landing() {
  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans selection:bg-blue-500/30 selection:text-blue-200 antialiased">
      {/* Existing Header Reused */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-grow">
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. How It Works Section */}
        <HowItWorksSection />

        {/* 3. Why WaitLess Section */}
        <WhyWaitlessSection />

        {/* 4. Business Owner CTA Section */}
        <BusinessCtaSection />
      </main>

      {/* 5. Footer */}
      <Footer />
    </div>
  );
}

export default Landing;
