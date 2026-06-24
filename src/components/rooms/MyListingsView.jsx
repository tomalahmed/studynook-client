"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { roomsApi } from "@/lib/api";
import RoomCard from "@/components/rooms/RoomCard";
import { ROUTES } from "@/lib/routes";
import PageLoader from "@/components/ui/PageLoader";

export default function MyListingsView() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    roomsApi
      .mine()
      .then((data) => setRooms(data.rooms ?? []))
      .catch((err) => {
        toast.error(err.message || "Could not load listings.");
        setRooms([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <PageLoader label="Loading your listings" minHeight="min-h-[280px]" />;
  }

  if (rooms.length === 0) {
    return (
      <div className="rounded-xl bg-white p-10 text-center candy-shadow-secondary">
        <p className="mb-6 text-on-surface-variant">
          You have not listed any rooms yet. Share your study space with the
          community!
        </p>
        <Link
          href={ROUTES.addRoom}
          className="inline-flex rounded-full bg-primary px-8 py-3 text-sm font-black text-on-primary candy-shadow-primary transition-transform hover:scale-[1.03]"
        >
          Add Your First Room
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
}
