import { DM_Sans } from "next/font/google";
import Navbar from "@/components/layout/Navbar";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export default function PublicLayout({ children }) {
  return (
    <div
      className={`${dmSans.variable} min-h-screen overflow-x-hidden bg-background font-body text-on-background`}
    >
      <Navbar />
      <main className="pt-24">{children}</main>
    </div>
  );
}
