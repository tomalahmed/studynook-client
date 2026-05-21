import { DM_Sans } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NotFoundView from "@/components/errors/NotFoundView";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata = {
  title: { absolute: "404 - StudyNook" },
  description: "The page you are looking for could not be found on StudyNook.",
};

export default function NotFound() {
  return (
    <div
      className={`${dmSans.variable} flex min-h-screen flex-col overflow-x-hidden bg-background font-body text-on-background`}
    >
      <Navbar />
      <NotFoundView />
      <Footer />
    </div>
  );
}
