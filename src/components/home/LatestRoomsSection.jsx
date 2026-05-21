"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { roomsApi } from "@/lib/api";
import RoomCard from "@/components/rooms/RoomCard";
import PageLoader from "@/components/ui/PageLoader";

export default function LatestRoomsSection() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    roomsApi
      .latest()
      .then((data) => setRooms(data.rooms ?? []))
      .catch(() => setRooms([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-black text-on-surface md:text-4xl">
            Available Study Rooms
          </h2>
          <p className="text-lg text-on-surface-variant">
            Freshly listed spaces ready for your next session.
          </p>
        </div>

        {loading ? (
          <PageLoader label="Loading rooms" minHeight="min-h-[280px]" />
        ) : rooms.length === 0 ? (
          <p className="text-center text-on-surface-variant">
            No rooms listed yet. Be the first to{" "}
            <Link href="/add-room" className="font-bold text-primary hover:underline">
              add a room
            </Link>
            .
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
