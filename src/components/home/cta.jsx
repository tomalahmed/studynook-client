"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { loginUrl, ROUTES } from "@/lib/routes";

export default function CtaSection() {
  const { isAuthenticated, isPending } = useAuth();
  const listRoomHref =
    !isPending && isAuthenticated ? ROUTES.addRoom : loginUrl(ROUTES.addRoom);

  return (
    <section className="px-6 py-20">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-xl bg-primary p-12 text-center text-on-primary candy-shadow-primary">
        <div
          className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white opacity-10"
          aria-hidden
        />
        <div
          className="absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-white opacity-10"
          aria-hidden
        />

        <h2 className="relative z-10 mb-6 text-4xl font-extrabold md:text-5xl">
          Have an empty room?
        </h2>
        <p className="relative z-10 mx-auto mb-10 max-w-2xl text-xl text-on-primary opacity-90">
          Join thousands of students and libraries who list their extra space.
          Start earning today and build a better study community.
        </p>
        <Link
          href={listRoomHref}
          className="relative z-10 inline-block rounded-full bg-white px-12 py-4 text-xl font-bold text-primary transition-all duration-200 hover:scale-105 active:scale-95"
        >
          List Your Room
        </Link>
      </div>
    </section>
  );
}
