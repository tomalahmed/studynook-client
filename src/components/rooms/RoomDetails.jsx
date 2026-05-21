"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ChevronRight,
  MapPin,
  Sparkles,
  Star,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { roomsApi } from "@/lib/api";
import { formatFloorLabel } from "@/lib/roomConstants";
import { buildPremiumPerks, getReviewDisplay } from "@/lib/roomPerks";
import { isRemoteImage, resolveRoomImage } from "@/lib/images";
import EditRoomPanel from "@/components/rooms/EditRoomPanel";
import RoomBookingSidebar from "@/components/rooms/RoomBookingSidebar";
import { ROUTES } from "@/lib/routes";

function Breadcrumbs({ roomName }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 flex flex-wrap items-center gap-1 text-sm font-bold text-on-surface-variant"
    >
      <Link href={ROUTES.home} className="transition-colors hover:text-primary">
        Home
      </Link>
      <ChevronRight className="h-4 w-4 shrink-0 opacity-50" strokeWidth={2.5} />
      <Link href={ROUTES.rooms} className="transition-colors hover:text-primary">
        Rooms
      </Link>
      <ChevronRight className="h-4 w-4 shrink-0 opacity-50" strokeWidth={2.5} />
      <span className="text-primary">{roomName}</span>
    </nav>
  );
}

function AboutDescription({ room }) {
  const name = room.name;
  const text = room.description?.trim();

  if (text) {
    const parts = text.split(/\n\n+/).filter(Boolean);
    if (parts.length >= 2) {
      return parts.map((paragraph, i) => (
        <p
          key={i}
          className="text-base leading-relaxed text-on-surface-variant"
        >
          {paragraph.split(name).map((segment, j, arr) => (
            <span key={j}>
              {segment}
              {j < arr.length - 1 ? (
                <strong className="font-bold text-primary">{name}</strong>
              ) : null}
            </span>
          ))}
        </p>
      ));
    }

    return (
      <>
        <p className="text-base leading-relaxed text-on-surface-variant">
          {text}
        </p>
        <p className="text-base leading-relaxed text-on-surface-variant">
          Whether you&apos;re preparing for finals or hosting a focused group
          session,{" "}
          <strong className="font-bold text-primary">{name}</strong> offers the
          calm and comfort you need to stay productive.
        </p>
      </>
    );
  }

  return (
    <>
      <p className="text-base leading-relaxed text-on-surface-variant">
        Experience the serene atmosphere at{" "}
        <strong className="font-bold text-primary">{name}</strong>. Perfect for
        students who need a quiet corner to focus on their studies without
        distractions.
      </p>
      <p className="text-base leading-relaxed text-on-surface-variant">
        With its comfortable seating and thoughtfully chosen amenities, this
        nook is designed to help you stay in the zone from the first page to
        the last.
      </p>
    </>
  );
}

export default function RoomDetails({ room: initialRoom }) {
  const router = useRouter();
  const { user, isAuthenticated, isPending } = useAuth();
  const [room, setRoom] = useState(initialRoom);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const isOwner =
    isAuthenticated && user?.id && room.owner?.id === String(user.id);

  const imageSrc = resolveRoomImage(room.image);
  const location = `${room.libraryBranch || "Central Library"}, ${formatFloorLabel(room.floor)}`;
  const perks = buildPremiumPerks(room);
  const review = getReviewDisplay(room.bookingCount);

  const handleDelete = async () => {
    setSaving(true);
    try {
      await roomsApi.remove(room.id);
      toast.success("Room deleted successfully");
      router.push(ROUTES.myListings);
    } catch (err) {
      toast.error(err.message || "Could not delete room.");
    } finally {
      setSaving(false);
      setDeleteOpen(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 md:py-12">
      <Breadcrumbs roomName={room.name} />

      <section className="relative mb-10 min-h-[280px] overflow-hidden rounded-3xl md:min-h-[360px]">
        <Image
          src={imageSrc}
          alt={room.name}
          fill
          priority
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="object-cover"
          unoptimized={isRemoteImage(imageSrc)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
        <div className="absolute right-0 bottom-0 left-0 p-6 md:p-10">
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-primary px-4 py-1.5 text-xs font-black tracking-wide text-on-primary uppercase candy-shadow-primary">
              Available Now
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold text-white backdrop-blur-md">
              {review.rating ? (
                <>
                  <Star
                    className="h-3.5 w-3.5 fill-white text-white"
                    strokeWidth={0}
                  />
                  {review.rating} ({review.label})
                </>
              ) : (
                review.label
              )}
            </span>
          </div>
          <h1 className="mb-2 text-3xl font-black tracking-tight text-white md:text-5xl">
            {room.name}
          </h1>
          <p className="flex items-center gap-2 text-sm font-medium text-white/90 md:text-base">
            <MapPin className="h-4 w-4 shrink-0" strokeWidth={2.5} />
            {location}
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
        <div className="space-y-10 lg:col-span-2">
          <article className="rounded-2xl bg-surface p-6 candy-shadow-secondary md:p-8">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-black text-on-surface md:text-2xl">
              <Sparkles
                className="h-6 w-6 text-primary"
                strokeWidth={2.25}
                aria-hidden
              />
              About this space
            </h2>
            <div className="space-y-4">
              <AboutDescription room={room} />
            </div>
          </article>

          <section>
            <h2 className="mb-6 text-xl font-black text-on-surface md:text-2xl">
              Premium Perks
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {perks.map((perk) => (
                <div
                  key={perk.label}
                  className="flex flex-col items-center justify-center rounded-2xl bg-primary-container/60 px-4 py-6 text-center transition-colors hover:bg-primary-container"
                >
                  <perk.Icon
                    className="mb-3 h-8 w-8 text-secondary"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <span className="text-sm font-bold text-on-surface">
                    {perk.label}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {isOwner ? (
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setEditOpen(true)}
                className="rounded-full border-2 border-primary px-8 py-3 font-bold text-primary transition-colors hover:bg-primary-container"
              >
                Edit listing
              </button>
              <button
                type="button"
                onClick={() => setDeleteOpen(true)}
                className="rounded-full border-2 border-red-400 px-8 py-3 font-bold text-red-600 transition-colors hover:bg-red-50"
              >
                Delete listing
              </button>
            </div>
          ) : null}
        </div>

        <RoomBookingSidebar
          room={room}
          isAuthenticated={isAuthenticated}
          isPending={isPending}
          onSuccess={() => router.refresh()}
        />
      </div>

      <EditRoomPanel
        room={room}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSaved={(updated) => {
          setRoom(updated);
          router.refresh();
        }}
      />

      {deleteOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="delete-room-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-surface p-6 candy-shadow-secondary md:p-8">
            <h3 id="delete-room-title" className="mb-2 text-xl font-black text-on-surface">
              Delete listing?
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-on-surface-variant">
              <strong className="text-on-surface">{room.name}</strong> will be
              removed permanently, including any booking history tied to this
              room.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteOpen(false)}
                disabled={saving}
                className="flex-1 rounded-full border-2 border-[#dcc8e0] py-3 text-sm font-bold text-on-surface transition-colors hover:bg-surface-variant disabled:opacity-50"
              >
                Keep listing
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="flex-1 rounded-full bg-red-600 py-3 text-sm font-black text-white transition-colors hover:bg-red-700 disabled:opacity-70"
              >
                {saving ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
