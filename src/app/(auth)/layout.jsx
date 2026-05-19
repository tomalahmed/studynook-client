import { DM_Sans } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export default function AuthLayout({ children }) {
  return (
    <div
      className={`${dmSans.variable} flex min-h-screen flex-col overflow-x-hidden bg-background font-body text-on-background`}
    >
      <Navbar />
      <main className="flex flex-1 items-center justify-center p-4 md:p-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
