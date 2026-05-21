import { DM_Sans } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageShell from "@/components/layout/PageShell";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export default function AuthLayout({ children }) {
  return (
    <div
      className={`${dmSans.variable} flex min-h-screen flex-col bg-background font-body text-on-background`}
    >
      <Navbar />
      <main className="flex flex-1 items-center justify-center overflow-x-clip px-4 py-8 sm:px-6 md:py-12 lg:px-10">
        <PageShell className="w-full max-w-6xl">{children}</PageShell>
      </main>
      <Footer />
    </div>
  );
}
