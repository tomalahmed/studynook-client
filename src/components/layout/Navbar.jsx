"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Rooms" },
];

function StudyNookLogo({ className = "size-6" }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <g clipPath="url(#clip0_nav_logo)">
        <path
          clipRule="evenodd"
          d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </g>
      <defs>
        <clipPath id="clip0_nav_logo">
          <rect fill="white" height="48" width="48" />
        </clipPath>
      </defs>
    </svg>
  );
}

function MenuIcon({ open }) {
  if (open) {
    return (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    );
  }

  return (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );
}

function NavLinkItem({ href, label, isActive, onNavigate }) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`block rounded-lg px-4 py-3 text-base font-bold transition-colors hover:bg-[#fbf2fb] hover:text-primary lg:px-0 lg:py-0 lg:text-sm lg:hover:bg-transparent ${
        isActive ? "text-primary" : "text-on-surface"
      }`}
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    closeMenu();
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header className="relative z-50 border-b border-solid border-[#dcc8e0] bg-background">
      <div className="flex items-center justify-between whitespace-nowrap px-4 py-3 lg:px-10">
        <Link href="/" className="flex items-center gap-4 text-on-surface">
          <div className="text-primary">
            <StudyNookLogo />
          </div>
          <h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">
            StudyNook
          </h2>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <nav className="hidden items-center gap-9 lg:flex" aria-label="Main">
            {navLinks.map(({ href, label }) => (
              <NavLinkItem
                key={href}
                href={href}
                label={label}
                isActive={isActive(href)}
                onNavigate={closeMenu}
              />
            ))}
          </nav>

          <Link
            href="/login"
            className="hidden h-10 min-w-[84px] items-center justify-center overflow-hidden rounded-full bg-primary px-6 text-sm font-bold leading-normal tracking-[0.015em] text-on-primary shadow-[0_4px_16px_rgba(224,64,160,0.2)] transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.03] active:scale-95 sm:flex"
          >
            <span className="truncate">Log In</span>
          </Link>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface transition-colors hover:bg-[#f2e8f2] hover:text-primary lg:hidden"
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <MenuIcon open={isOpen} />
          </button>
        </div>
      </div>

      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 top-[65px] z-40 bg-[#2e1a28]/20 lg:hidden"
          aria-label="Close menu"
          onClick={closeMenu}
        />
      )}

      <nav
        id="mobile-nav"
        aria-label="Mobile"
        className={`overflow-hidden border-t border-[#dcc8e0] bg-background transition-all duration-300 ease-in-out lg:hidden ${
          isOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-1 px-4 py-4">
          {navLinks.map(({ href, label }) => (
            <NavLinkItem
              key={href}
              href={href}
              label={label}
              isActive={isActive(href)}
              onNavigate={closeMenu}
            />
          ))}
          <Link
            href="/login"
            onClick={closeMenu}
            className="mt-2 flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-bold text-on-primary shadow-[0_4px_16px_rgba(224,64,160,0.2)] transition-transform active:scale-95 sm:hidden"
          >
            Log In
          </Link>
        </div>
      </nav>
    </header>
  );
}
