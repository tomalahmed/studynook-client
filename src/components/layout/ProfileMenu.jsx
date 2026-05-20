"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";

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

export default function ProfileMenu({ user, onNavigate }) {
  const router = useRouter();
  const menuRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    router.push("/");
    router.refresh();
  };

  const displayName = user.name || "Student";

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border-2 border-[#dcc8e0] bg-white py-1.5 pr-3 pl-1.5 transition-all hover:border-primary hover:shadow-[0_4px_16px_rgba(224,64,160,0.15)]"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {user.image ? (
          <Image
            src={user.image}
            alt={displayName}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
            unoptimized
          />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container text-xs font-black text-on-primary-container">
            {getInitials(displayName)}
          </span>
        )}
        <span className="hidden max-w-[120px] truncate text-sm font-bold text-on-surface sm:inline">
          {displayName}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-on-surface-variant transition-transform ${isOpen ? "rotate-180" : ""}`}
          strokeWidth={2.5}
        />
      </button>

      {isOpen ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-[#dcc8e0] bg-white py-2 shadow-[0_12px_40px_rgba(124,82,170,0.15)]"
        >
          <div className="border-b border-[#dcc8e0] px-4 py-3">
            <p className="truncate text-sm font-black text-on-surface">
              {displayName}
            </p>
            <p className="truncate text-xs text-on-surface-variant">
              {user.email}
            </p>
          </div>

          <Link
            href="/my-listings"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              onNavigate?.();
            }}
            className="block px-4 py-2.5 text-sm font-bold text-on-surface transition-colors hover:bg-[#fbf2fb] hover:text-primary"
          >
            My Listings
          </Link>
          <Link
            href="/my-bookings"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              onNavigate?.();
            }}
            className="block px-4 py-2.5 text-sm font-bold text-on-surface transition-colors hover:bg-[#fbf2fb] hover:text-primary"
          >
            My Bookings
          </Link>

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
        </div>
      ) : null}
    </div>
  );
}
