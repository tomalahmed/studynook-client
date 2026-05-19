"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Rooms" },
];

const panelVariants = {
  closed: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.32, ease: [0.4, 0, 1, 1] },
      opacity: { duration: 0.2 },
    },
  },
  open: {
    height: "auto",
    opacity: 1,
    transition: {
      height: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
      opacity: { duration: 0.28, delay: 0.06 },
    },
  },
};

const listVariants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.12 },
  },
  closed: {
    transition: { staggerChildren: 0.04, staggerDirection: -1 },
  },
};

const itemVariants = {
  closed: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
  },
};

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
  const transition = { duration: 0.28, ease: [0.22, 1, 0.36, 1] };

  return (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <motion.path
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={open ? { d: "M6 6 L18 18" } : { d: "M4 7 H20" }}
        transition={transition}
      />
      <motion.path
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={open ? { opacity: 0 } : { opacity: 1, d: "M4 12 H20" }}
        transition={transition}
      />
      <motion.path
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={open ? { d: "M6 18 L18 6" } : { d: "M4 17 H20" }}
        transition={transition}
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

          <div className="hidden items-center gap-2 sm:flex sm:gap-3">
            <Link
              href="/login"
              className="flex h-10 min-w-[84px] items-center justify-center overflow-hidden rounded-full bg-primary px-6 text-sm font-bold leading-normal tracking-[0.015em] text-on-primary shadow-[0_4px_16px_rgba(224,64,160,0.2)] transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.03] active:scale-95"
            >
              <span className="truncate">Log In</span>
            </Link>
            <Link
              href="/register"
              className="flex h-10 min-w-[84px] items-center justify-center overflow-hidden rounded-full border-2 border-[#d4399b] bg-white px-6 text-sm font-bold leading-normal tracking-[0.015em] text-on-surface transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:bg-surface-variant hover:scale-[1.03] active:scale-95"
            >
              <span className="truncate">Register</span>
            </Link>
          </div>

          <motion.button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface transition-colors hover:bg-surface-variant hover:text-primary lg:hidden"
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsOpen((prev) => !prev)}
            whileTap={{ scale: 0.92 }}
          >
            <MenuIcon open={isOpen} />
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.button
            type="button"
            key="mobile-overlay"
            className="fixed inset-0 top-[65px] z-40 bg-[#2e1a28]/30 backdrop-blur-[2px] lg:hidden"
            aria-label="Close menu"
            onClick={closeMenu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      <motion.nav
        id="mobile-nav"
        aria-label="Mobile"
        aria-hidden={!isOpen}
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={panelVariants}
        className="relative z-50 overflow-hidden border-t border-[#dcc8e0] bg-background shadow-[0_16px_40px_rgba(46,26,40,0.14)] lg:hidden"
      >
        <motion.div
          className="flex flex-col gap-1 px-4 py-5"
          variants={listVariants}
        >
          {navLinks.map(({ href, label }) => (
            <motion.div key={href} variants={itemVariants}>
              <NavLinkItem
                href={href}
                label={label}
                isActive={isActive(href)}
                onNavigate={closeMenu}
              />
            </motion.div>
          ))}

          <motion.div
            className="mt-3 flex flex-col gap-2 border-t border-[#dcc8e0] pt-4 sm:hidden"
            variants={itemVariants}
          >
            <Link
              href="/login"
              onClick={closeMenu}
              className="flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-bold text-on-primary shadow-[0_4px_16px_rgba(224,64,160,0.2)] transition-transform active:scale-95"
            >
              Log In
            </Link>
            <Link
              href="/register"
              onClick={closeMenu}
              className="flex h-11 items-center justify-center rounded-full border-2 border-[#dcc8e0] bg-white px-6 text-sm font-bold text-on-surface transition-transform active:scale-95"
            >
              Register
            </Link>
          </motion.div>
        </motion.div>
      </motion.nav>
    </header>
  );
}
