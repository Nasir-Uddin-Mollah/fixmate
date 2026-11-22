import CustomerReviewsSection from "@/components/home/customer-reviews-section";
import HeroSection from "@/components/home/hero-section";
import HowItWorksSection from "@/components/home/how-it-works-section";
import RepairCategoriesSection from "@/components/home/repair-categories-section";
import TechnicianCtaSection from "@/components/home/technician-cta-section";
import WhyFixMateSection from "@/components/home/why-fixmate-section";

const HomePage = () => {
  return (
    <div className="flex flex-col gap-20 pb-20">
      <HeroSection />
      <RepairCategoriesSection />
      <HowItWorksSection />
      <WhyFixMateSection />
      <CustomerReviewsSection />
      <TechnicianCtaSection />
    </div>
  );
};

export default HomePage;
