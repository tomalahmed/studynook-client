import { DM_Sans } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export default function PrivateLayout({ children }) {
  return (
    <div
      className={`${dmSans.variable} min-h-screen overflow-x-hidden bg-background font-body text-on-background`}
    >
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
