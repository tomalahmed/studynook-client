import HeroBanner from "@/components/home/HeroBanner";
import BenefitsSection from "@/components/home/BenefitsSection";
import HowItWorksSection from "@/components/home/howitworks";
import CtaSection from "@/components/home/cta";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <BenefitsSection />
      <HowItWorksSection />
      <CtaSection />
    </>
  );
}
