"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Rooms" },
];

function NavLink({ href, label, isActive }) {
  if (isActive) {
    return (
      <Link
        href={href}
        className="border-b-4 border-primary pb-1 font-medium text-primary transition-colors duration-200 dark:text-primary-fixed-dim"
      >
        {label}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="font-medium text-on-surface-variant transition-colors duration-200 hover:text-primary dark:text-surface-variant"
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="fixed top-0 z-50 w-full bg-surface shadow-[0_4px_20px_rgba(224,64,160,0.15)] dark:bg-on-surface">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-8 py-4">
        <Link
          href="/"
          className="text-2xl font-black tracking-tighter text-primary dark:text-primary-fixed-dim"
        >
          StudyNook
        </Link>

        <div className="hidden items-center gap-8 font-body text-base md:flex">
          {navLinks.map(({ href, label }) => (
            <NavLink
              key={href}
              href={href}
              label={label}
              isActive={isActive(href)}
            />
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="rounded-full px-6 py-2 font-medium text-on-surface-variant transition-all duration-200 hover:text-primary active:scale-95"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="candy-shadow-primary rounded-full bg-primary px-6 py-2 font-bold text-on-primary transition-transform duration-200 ease-out hover:scale-[1.03] hover:shadow-lg active:scale-95"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
