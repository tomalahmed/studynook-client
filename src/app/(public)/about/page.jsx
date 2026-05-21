import AboutContent from "@/components/about/AboutContent";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata(
  "About",
  "Learn how StudyNook helps students book study rooms and list spaces they manage.",
);

export default function AboutPage() {
  return <AboutContent />;
}
