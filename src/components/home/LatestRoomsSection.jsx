"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { roomsApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import PageLoader from "@/components/ui/PageLoader";
import TrendingRoomCard from "@/components/home/TrendingRoomCard";
import { loginUrl, ROUTES } from "@/lib/routes";

export default function LatestRoomsSection() {
  const { isAuthenticated, isPending } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const addRoomHref =
    !isPending && isAuthenticated ? ROUTES.addRoom : loginUrl(ROUTES.addRoom);

  useEffect(() => {
    roomsApi
      .latest()
      .then((data) => setRooms(data.rooms ?? []))
      .catch(() => setRooms([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col items-end justify-between gap-6 md:flex-row">
          <div>
            <h2 className="mb-4 text-3xl font-extrabold text-on-surface md:text-5xl">
              Trending Nooks
            </h2>
            <p className="text-lg text-on-surface-variant">
              Check out these highly-rated study spots available right now.
            </p>
          </div>
          <Link
            href={ROUTES.rooms}
            className="shrink-0 rounded-full bg-secondary-container px-8 py-3 font-bold text-on-secondary-container transition-all hover:bg-secondary-container/80"
          >
            View All Rooms
          </Link>
        </div>

        {loading ? (
          <PageLoader label="Loading rooms" minHeight="min-h-[280px]" />
        ) : rooms.length === 0 ? (
          <p className="text-center text-on-surface-variant">
            No rooms listed yet. Be the first to{" "}
            <Link href={addRoomHref} className="font-bold text-primary hover:underline">
              add a room
            </Link>
            .
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {rooms.map((room, index) => (
              <TrendingRoomCard
                key={room.id}
                room={room}
                index={index}
                showPopularBadge={index === 0}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
