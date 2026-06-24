"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { RiSparkling2Fill } from "react-icons/ri";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/prompts", label: "All Prompts" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent)]/15 text-[var(--accent)] transition-colors group-hover:bg-[var(--accent)]/25">
            <RiSparkling2Fill className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-[var(--text)]">
            PromptForge
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "text-[var(--accent)]"
                  : "text-[var(--muted)] hover:text-[var(--text)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--text)]"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--bg)] transition-opacity hover:opacity-90"
          >
            Register
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-[var(--text)] md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-[var(--border)] bg-[var(--surface)] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive(link.href)
                    ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                    : "text-[var(--muted)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-[var(--border)]" />
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted)]"
            >
              Login
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg bg-[var(--accent)] px-3 py-2 text-center text-sm font-semibold text-[var(--bg)]"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
