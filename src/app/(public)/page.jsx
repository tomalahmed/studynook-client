import HeroBanner from "@/components/home/HeroBanner";
import LatestRoomsSection from "@/components/home/LatestRoomsSection";
import BenefitsSection from "@/components/home/BenefitsSection";
import HowItWorksSection from "@/components/home/howitworks";
import CtaSection from "@/components/home/cta";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata(
  "Home",
  "Browse and book quiet, private study rooms in your library. List your own room and earn.",
);
export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <BenefitsSection />
      <LatestRoomsSection />
      <HowItWorksSection />
      <CtaSection />
    </>
  );
}
