import { Geist, Geist_Mono } from "next/font/google";
import SessionTokenSync from "@/components/auth/SessionTokenSync";
import ToasterProvider from "@/components/providers/ToasterProvider";
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
  title: "StudyNook",
  description:
    "Browse and book quiet, private study rooms in your library.",
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
