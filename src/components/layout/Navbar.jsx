"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import ProfileMenu from "@/components/layout/ProfileMenu";
import { ROUTES } from "@/lib/routes";

const baseNavLinks = [
  { href: ROUTES.home, label: "Home" },
  { href: ROUTES.rooms, label: "Rooms" },
  { href: ROUTES.about, label: "About" },
];

const authenticatedNavLinks = [
  { href: ROUTES.addRoom, label: "Add Room" },
  { href: ROUTES.myListings, label: "My Listings" },
  { href: ROUTES.myBookings, label: "My Bookings" },
];

const listVariants = {
  open: {
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
  closed: {
    transition: { staggerChildren: 0.03, staggerDirection: -1 },
  },
};

const itemVariants = {
  closed: { opacity: 0, x: -12 },
  open: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
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

function NavLinkItem({ href, label, isActive, onNavigate, className = "" }) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`block rounded-xl px-4 py-3 text-base font-bold transition-colors hover:bg-surface-container-low hover:text-primary lg:rounded-none lg:px-0 lg:py-0 lg:text-sm lg:hover:bg-transparent ${
        isActive ? "text-primary" : "text-on-surface"
      } ${className}`}
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, isPending } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(57);

  const publicLinks = isAuthenticated
    ? baseNavLinks.filter((link) => link.href !== ROUTES.about)
    : baseNavLinks;

  const navLinks = isAuthenticated
    ? [...publicLinks, ...authenticatedNavLinks]
    : baseNavLinks;

  const isActive = (href) => {
    if (href === ROUTES.home) {
      return pathname === ROUTES.home;
    }
    if (href === ROUTES.rooms) {
      return pathname === ROUTES.rooms || pathname.startsWith(`${ROUTES.rooms}/`);
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const closeMenu = useCallback(() => setIsOpen(false), []);

  const measureHeader = useCallback(() => {
    setHeaderHeight(headerRef.current?.offsetHeight ?? 57);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  useEffect(() => {
    measureHeader();
    window.addEventListener("resize", measureHeader);
    return () => window.removeEventListener("resize", measureHeader);
  }, [measureHeader]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-[100] isolate w-full border-b border-solid border-[#dcc8e0] bg-background/90 shadow-[0_1px_0_rgba(220,200,224,0.6)] backdrop-blur-lg backdrop-saturate-150 supports-[backdrop-filter]:bg-background/80"
      style={{ "--nav-height": `${headerHeight}px` }}
    >
      <div className="flex items-center justify-between px-4 py-3 lg:px-10">
        <Link href={ROUTES.home} className="flex min-w-0 items-center gap-3 text-on-surface sm:gap-4">
          <div className="shrink-0 text-primary">
            <StudyNookLogo />
          </div>
          <h2 className="truncate text-lg font-bold leading-tight tracking-[-0.015em] sm:text-xl">
            StudyNook
          </h2>
        </Link>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <nav
            className="hidden items-center gap-5 xl:gap-9 lg:flex"
            aria-label="Main"
          >
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

          {!isPending && isAuthenticated && user ? (
            <div className="hidden lg:block">
              <ProfileMenu user={user} onNavigate={closeMenu} />
            </div>
          ) : null}

          {!isPending && !isAuthenticated ? (
            <div className="hidden items-center gap-2 sm:flex sm:gap-3">
              <Link
                href={ROUTES.login}
                className="flex h-10 min-w-[84px] items-center justify-center overflow-hidden rounded-full bg-primary px-5 text-sm font-bold text-on-primary shadow-[0_4px_16px_rgba(224,64,160,0.2)] transition-transform duration-200 hover:scale-[1.03] active:scale-95 sm:px-6"
              >
                <span className="truncate">Log In</span>
              </Link>
              <Link
                href={ROUTES.register}
                className="flex h-10 min-w-[84px] items-center justify-center overflow-hidden rounded-full border-2 border-[#dcc8e0] bg-white px-5 text-sm font-bold text-on-surface transition-transform duration-200 hover:bg-surface-variant hover:scale-[1.03] active:scale-95 sm:px-6"
              >
                <span className="truncate">Register</span>
              </Link>
            </div>
          ) : null}

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
        {isOpen ? (
          <>
            <motion.button
              type="button"
              key="mobile-overlay"
              className="fixed inset-0 z-40 bg-[#2e1a28]/40 backdrop-blur-[3px] lg:hidden"
              style={{ top: headerHeight }}
              aria-label="Close menu"
              onClick={closeMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
            />
            <motion.nav
              id="mobile-nav"
              key="mobile-panel"
              aria-label="Mobile"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-0 z-50 overflow-y-auto overscroll-contain border-t border-[#dcc8e0] bg-background shadow-[0_20px_48px_rgba(46,26,40,0.18)] lg:hidden"
              style={{
                top: headerHeight,
                maxHeight: `calc(100dvh - ${headerHeight}px)`,
              }}
            >
              <motion.div
                className="flex flex-col gap-1 px-4 py-5 pb-8"
                initial="closed"
                animate="open"
                exit="closed"
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

                {!isPending && isAuthenticated && user ? (
                  <motion.div
                    className="mt-2 border-t border-[#dcc8e0] pt-4"
                    variants={itemVariants}
                  >
                    <ProfileMenu
                      user={user}
                      onNavigate={closeMenu}
                      variant="inline"
                    />
                  </motion.div>
                ) : null}

                {!isPending && !isAuthenticated ? (
                  <motion.div
                    className="mt-3 flex flex-col gap-2 border-t border-[#dcc8e0] pt-4"
                    variants={itemVariants}
                  >
                    <Link
                      href={ROUTES.login}
                      onClick={closeMenu}
                      className="flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-bold text-on-primary shadow-[0_4px_16px_rgba(224,64,160,0.2)] transition-transform active:scale-95"
                    >
                      Log In
                    </Link>
                    <Link
                      href={ROUTES.register}
                      onClick={closeMenu}
                      className="flex h-11 items-center justify-center rounded-full border-2 border-[#dcc8e0] bg-white px-6 text-sm font-bold text-on-surface transition-transform active:scale-95"
                    >
                      Register
                    </Link>
                  </motion.div>
                ) : null}
              </motion.div>
            </motion.nav>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
