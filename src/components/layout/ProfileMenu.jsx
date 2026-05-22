"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { ROUTES } from "@/lib/routes";

function getInitials(name) {
  if (!name) {
    return "?";
  }

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function UserAvatar({ user, displayName, size = "md" }) {
  const sizeClass = size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm";

  if (user.image) {
    return (
      <Image
        src={user.image}
        alt={displayName}
        width={size === "sm" ? 32 : 40}
        height={size === "sm" ? 32 : 40}
        className={`${sizeClass} rounded-full object-cover`}
        unoptimized
      />
    );
  }

  return (
    <span
      className={`flex ${sizeClass} items-center justify-center rounded-full bg-primary-container font-black text-on-primary-container`}
    >
      {getInitials(displayName)}
    </span>
  );
}

export default function ProfileMenu({ user, onNavigate, variant = "dropdown" }) {
  const router = useRouter();
  const menuRef = useRef(null);
  const menuId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const displayName = user.name || "Student";

  useEffect(() => {
    if (variant !== "dropdown") {
      return undefined;
    }

    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [variant]);

  const handleLogout = async () => {
    setIsSigningOut(true);
    await fetch("/api/auth/clear-token", {
      method: "POST",
      credentials: "include",
    });
    await authClient.signOut();
    setIsSigningOut(false);
    setIsOpen(false);
    onNavigate?.();
    router.push(ROUTES.home);
    router.refresh();
  };

  const menuLinks = [
    { href: ROUTES.myListings, label: "My Listings" },
    { href: ROUTES.myBookings, label: "My Bookings" },
  ];

  if (variant === "inline") {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3 rounded-xl bg-surface-container-low px-4 py-3">
          <UserAvatar user={user} displayName={displayName} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-black text-on-surface">{displayName}</p>
            <p className="truncate text-xs text-on-surface-variant">{user.email}</p>
          </div>
        </div>
        {menuLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className="rounded-xl px-4 py-3 text-base font-bold text-on-surface transition-colors hover:bg-surface-container-low hover:text-primary"
          >
            {label}
          </Link>
        ))}
        <button
          type="button"
          onClick={handleLogout}
          disabled={isSigningOut}
          className="flex items-center gap-2 rounded-xl px-4 py-3 text-left text-base font-bold text-[#c41e5a] transition-colors hover:bg-[#ffe8e8] disabled:opacity-60"
        >
          <LogOut className="h-4 w-4" strokeWidth={2.5} />
          {isSigningOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    );
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border-2 border-[#dcc8e0] bg-white py-1.5 pr-3 pl-1.5 transition-all hover:border-primary hover:shadow-[0_4px_16px_rgba(224,64,160,0.15)]"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={menuId}
      >
        <UserAvatar user={user} displayName={displayName} size="sm" />
        <span className="hidden max-w-[120px] truncate text-sm font-bold text-on-surface md:inline">
          {displayName}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-on-surface-variant transition-transform ${isOpen ? "rotate-180" : ""}`}
          strokeWidth={2.5}
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            id={menuId}
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 z-60 mt-2 w-56 overflow-hidden rounded-2xl border border-[#dcc8e0] bg-white py-2 shadow-[0_12px_40px_rgba(124,82,170,0.18)]"
          >
            <div className="border-b border-[#dcc8e0] px-4 py-3">
              <p className="truncate text-sm font-black text-on-surface">{displayName}</p>
              <p className="truncate text-xs text-on-surface-variant">{user.email}</p>
            </div>

            {menuLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                role="menuitem"
                onClick={() => {
                  setIsOpen(false);
                  onNavigate?.();
                }}
                className="block px-4 py-2.5 text-sm font-bold text-on-surface transition-colors hover:bg-[#fbf2fb] hover:text-primary"
              >
                {label}
              </Link>
            ))}

            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              disabled={isSigningOut}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-bold text-[#c41e5a] transition-colors hover:bg-[#ffe8e8] disabled:opacity-60"
            >
              <LogOut className="h-4 w-4" strokeWidth={2.5} />
              {isSigningOut ? "Logging out..." : "Logout"}
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
