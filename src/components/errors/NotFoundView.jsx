"use client";

import Image from "next/image";
import Link from "next/link";
import { NOT_FOUND_IMAGE } from "@/lib/images";
import { useEffect, useRef } from "react";
import { Home, Sparkles, DoorOpen } from "lucide-react";

const BUBBLE_COLORS = ["#e040a0", "#7c52aa", "#0096cc", "#ffd6ee"];

function createBubble(container) {
  const bubble = document.createElement("div");
  const size = Math.random() * 40 + 10;
  const color = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];

  Object.assign(bubble.style, {
    position: "absolute",
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: color,
    borderRadius: "50%",
    opacity: "0.2",
    left: `${Math.random() * 100}%`,
    bottom: "-50px",
    filter: "blur(2px)",
    pointerEvents: "none",
  });

  container.appendChild(bubble);

  const duration = (Math.random() * 10 + 5) * 1000;
  const horizontalTravel = (Math.random() - 0.5) * 100;

  const animation = bubble.animate(
    [
      { transform: "translateY(0) translateX(0)", opacity: 0.2 },
      {
        transform: `translateY(-110vh) translateX(${horizontalTravel}px)`,
        opacity: 0,
      },
    ],
    { duration, easing: "linear" },
  );

  animation.onfinish = () => bubble.remove();
}

export default function NotFoundView() {
  const bubbleRef = useRef(null);

  useEffect(() => {
    const container = bubbleRef.current;
    if (!container) return;

    const interval = setInterval(() => createBubble(container), 800);
    const timeouts = Array.from({ length: 10 }, (_, i) =>
      setTimeout(() => createBubble(container), Math.random() * 5000),
    );

    return () => {
      clearInterval(interval);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <main className="relative flex grow flex-col items-center justify-center overflow-hidden px-6 py-12">
      <div
        ref={bubbleRef}
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden
      />

      <div className="absolute top-10 left-10 h-24 w-24 animate-pulse rounded-full bg-primary-container opacity-30 blur-3xl" />
      <div
        className="absolute right-10 bottom-10 h-32 w-32 animate-pulse rounded-full bg-secondary-container opacity-30 blur-3xl"
        style={{ animationDelay: "1s" }}
      />
      <div className="absolute top-1/2 left-1/4 h-12 w-12 rounded-full bg-tertiary-container opacity-20 blur-xl" />

      <div className="z-10 flex w-full max-w-4xl flex-col items-center text-center">
        <div className="group relative mb-8">
          <div className="animate-float-notfound">
            <Image
              src={NOT_FOUND_IMAGE}
              alt="404 — page not found illustration"
              width={500}
              height={400}
              priority
              className="h-auto w-full max-w-[500px] rounded-xl"
            />
          </div>
          <div className="absolute -top-4 -right-4 text-tertiary transition-transform duration-500 group-hover:rotate-45">
            <Sparkles className="h-10 w-10 fill-tertiary" strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="mb-4 text-7xl font-black tracking-tighter text-primary drop-shadow-md md:text-9xl">
          404
        </h1>
        <h2 className="mb-6 px-4 text-2xl font-bold text-on-surface md:text-4xl">
          Oops! Looks like this page got{" "}
          <span className="text-secondary italic underline decoration-tertiary decoration-4 underline-offset-4">
            lost
          </span>{" "}
          in the candy shop.
        </h2>
        <p className="mb-12 max-w-lg text-lg font-medium text-on-surface-variant md:text-xl">
          The treat you&apos;re looking for isn&apos;t here, but don&apos;t
          worry—there are plenty of other sweet spots to explore!
        </p>

        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <Link
            href="/"
            className="group flex items-center gap-3 rounded-full bg-primary px-10 py-5 text-xl font-extrabold text-on-primary candy-shadow-primary transition-all duration-300 ease-out hover:scale-105 active:scale-95"
          >
            <Home className="h-6 w-6" strokeWidth={2.5} />
            Back to Home
          </Link>
          <Link
            href="/rooms"
            className="group flex items-center gap-3 rounded-full border-4 border-secondary/10 bg-surface-variant px-10 py-5 text-xl font-extrabold text-secondary transition-all duration-300 ease-out hover:scale-105 hover:bg-secondary-container active:scale-95"
          >
            <DoorOpen className="h-6 w-6" strokeWidth={2.5} />
            Browse Rooms
          </Link>
        </div>
      </div>
    </main>
  );
}
