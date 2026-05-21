import { Geist, Geist_Mono } from "next/font/google";
import SessionTokenSync from "@/components/auth/SessionTokenSync";
import ToasterProvider from "@/components/providers/ToasterProvider";
import { getMetadataBase, SITE_NAME } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: SITE_NAME,
    template: "%s",
  },
  description:
    "Browse and book quiet, private study rooms in your library. List your own room and earn.",
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    title: SITE_NAME,
    description:
      "Browse and book quiet, private study rooms in your library.",
    images: [{ url: "/images/Banner.png", width: 800, height: 800, alt: SITE_NAME }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SessionTokenSync />
        {children}
        <ToasterProvider />
      </body>
    </html>
  );
}
