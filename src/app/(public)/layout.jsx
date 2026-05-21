import { DM_Sans } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageShell from "@/components/layout/PageShell";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export default function PublicLayout({ children }) {
  return (
    <div
      className={`${dmSans.variable} flex min-h-screen flex-col bg-background font-body text-on-background`}
    >
      <Navbar />
      <main className="flex-1 overflow-x-clip">
        <PageShell>{children}</PageShell>
      </main>
      <Footer />
    </div>
  );
}
