import HeroBanner from "@/components/home/HeroBanner";
import LatestRoomsSection from "@/components/home/LatestRoomsSection";
import BenefitsSection from "@/components/home/BenefitsSection";
import HowItWorksSection from "@/components/home/howitworks";
import CtaSection from "@/components/home/cta";

export const metadata = {
  title: "StudyNook – Home",
  description:
    "Browse and book quiet, private study rooms in your library. List your own room and earn.",
};

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <LatestRoomsSection />
      <BenefitsSection />
      <HowItWorksSection />
      <CtaSection />
    </>
  );
}
