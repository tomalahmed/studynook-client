"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";

export default function RoomDetails({ room }) {
  const router = useRouter();
  const { isAuthenticated, isPending } = useAuth();

  const handleBookNow = () => {
    if (isPending) {
      return;
    }

    if (!isAuthenticated) {
      router.push(`/login?callbackUrl=/rooms/${room.id}`);
      return;
    }

    toast.success(`Booking flow for "${room.name}" coming soon!`);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <Link
        href="/rooms"
        className="mb-6 inline-flex text-sm font-bold text-secondary hover:text-primary"
      >
        ← Back to Rooms
      </Link>

      <article className="overflow-hidden rounded-xl border-8 border-white bg-white candy-shadow-secondary">
        <div className="relative aspect-video w-full bg-surface-variant">
          <Image
            src={room.image}
            alt={room.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 960px"
            className="object-cover"
          />
          <div className="absolute top-4 right-4 rounded-full bg-primary px-4 py-1 text-sm font-bold text-on-primary shadow-lg">
            ${room.pricePerHour.toFixed(2)}/hr
          </div>
        </div>

        <div className="p-8 md:p-10">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-on-surface md:text-4xl">
                {room.name}
              </h1>
              <p className="mt-2 text-on-surface-variant">{room.libraryBranch}</p>
            </div>
            <div className="flex items-center gap-1 text-primary">
              <Star className="h-5 w-5 fill-primary" strokeWidth={0} />
              <span className="font-bold">New</span>
            </div>
          </div>

          <p className="mb-6 text-lg leading-relaxed text-on-surface-variant">
            {room.description}
          </p>

          <div className="mb-8 flex flex-wrap gap-2">
            <span className="rounded-full bg-secondary-container px-3 py-1 text-xs font-bold text-on-secondary-container">
              {room.roomType}
            </span>
            <span className="rounded-full bg-surface-variant px-3 py-1 text-xs font-bold text-on-surface-variant">
              {room.capacity} People
            </span>
            <span className="rounded-full bg-surface-variant px-3 py-1 text-xs font-bold text-on-surface-variant">
              Floor {room.floor}
            </span>
            {room.amenities.map((amenity) => (
              <span
                key={amenity}
                className="rounded-full bg-[#c8eaff] px-3 py-1 text-xs font-bold text-tertiary"
              >
                {amenity}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={handleBookNow}
            disabled={isPending}
            className="w-full rounded-full bg-primary py-4 text-lg font-black text-on-primary candy-shadow-primary transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.03] active:scale-[0.97] disabled:opacity-70 sm:w-auto sm:px-12"
          >
            Book Now
          </button>
        </div>
      </article>
    </div>
  );
}
