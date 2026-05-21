"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { roomsApi } from "@/lib/api";
import {
  ASSIGNMENT_AMENITIES,
  formatCapacityLabel,
  formatFloorLabel,
} from "@/lib/roomConstants";
import BookingModal from "@/components/rooms/BookingModal";

export default function RoomDetails({ room: initialRoom }) {
  const router = useRouter();
  const { user, isAuthenticated, isPending } = useAuth();
  const [room, setRoom] = useState(initialRoom);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const isOwner =
    isAuthenticated && user?.id && room.owner?.id === String(user.id);

  const imageSrc =
    room.image?.startsWith("http") || room.image?.startsWith("/")
      ? room.image
      : "/images/library.png";

  const handleBookNow = () => {
    if (isPending) return;
    if (!isAuthenticated) {
      router.push(`/login?callbackUrl=/rooms/${room.id}`);
      return;
    }
    setBookingOpen(true);
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await roomsApi.remove(room.id);
      toast.success("Room deleted successfully");
      router.push("/my-listings");
    } catch (err) {
      toast.error(err.message || "Could not delete room.");
    } finally {
      setSaving(false);
      setDeleteOpen(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const amenities = ASSIGNMENT_AMENITIES.filter(
      (a) => form.get(`amenity-${a}`) === "on",
    );

    setSaving(true);
    try {
      const data = await roomsApi.update(room.id, {
        name: form.get("name"),
        description: form.get("description"),
        image: form.get("image"),
        floor: form.get("floor"),
        capacity: Number(form.get("capacity")),
        hourlyRate: Number(form.get("hourlyRate")),
        amenities,
      });
      setRoom(data.room);
      toast.success("Room updated successfully");
      setEditOpen(false);
    } catch (err) {
      toast.error(err.message || "Could not update room.");
    } finally {
      setSaving(false);
    }
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
            src={imageSrc}
            alt={room.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 960px"
            className="object-cover"
            unoptimized={imageSrc.startsWith("http")}
          />
          <div className="absolute top-4 right-4 rounded-full bg-primary px-4 py-1 text-sm font-bold text-on-primary shadow-lg">
            ${Number(room.hourlyRate).toFixed(2)}/hr
          </div>
        </div>

        <div className="p-8 md:p-10">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-on-surface md:text-4xl">
                {room.name}
              </h1>
              <p className="mt-2 text-on-surface-variant">
                {formatFloorLabel(room.floor)} · {formatCapacityLabel(room.capacity)}
              </p>
              <p className="mt-1 text-sm font-bold text-secondary">
                {room.bookingCount ?? 0} bookings
              </p>
            </div>
          </div>

          <p className="mb-6 text-lg leading-relaxed text-on-surface-variant">
            {room.description}
          </p>

          <div className="mb-8 flex flex-wrap gap-2">
            {(room.amenities || []).map((amenity) => (
              <span
                key={amenity}
                className="rounded-full bg-[#c8eaff] px-3 py-1 text-xs font-bold text-tertiary"
              >
                {amenity}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleBookNow}
              disabled={isPending}
              className="rounded-full bg-primary px-12 py-4 text-lg font-black text-on-primary candy-shadow-primary transition-all hover:scale-[1.03] disabled:opacity-70"
            >
              {isAuthenticated ? "Book Now" : "Login to Book"}
            </button>
            {isOwner ? (
              <>
                <button
                  type="button"
                  onClick={() => setEditOpen(true)}
                  className="rounded-full border-2 border-primary px-8 py-4 font-bold text-primary"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteOpen(true)}
                  className="rounded-full border-2 border-red-400 px-8 py-4 font-bold text-red-600"
                >
                  Delete
                </button>
              </>
            ) : null}
          </div>
        </div>
      </article>

      <BookingModal
        room={room}
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        onSuccess={() => router.refresh()}
      />

      {editOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={handleEditSubmit}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6"
          >
            <h2 className="mb-4 text-xl font-black">Edit room</h2>
            <div className="space-y-3">
              <input
                name="name"
                defaultValue={room.name}
                required
                className="w-full rounded-full bg-surface-variant px-4 py-2"
              />
              <textarea
                name="description"
                defaultValue={room.description}
                required
                rows={3}
                className="w-full rounded-2xl bg-surface-variant px-4 py-2"
              />
              <input
                name="image"
                defaultValue={room.image}
                required
                placeholder="Image URL"
                className="w-full rounded-full bg-surface-variant px-4 py-2"
              />
              <input
                name="floor"
                defaultValue={room.floor}
                required
                className="w-full rounded-full bg-surface-variant px-4 py-2"
              />
              <input
                name="capacity"
                type="number"
                min={1}
                defaultValue={room.capacity}
                required
                className="w-full rounded-full bg-surface-variant px-4 py-2"
              />
              <input
                name="hourlyRate"
                type="number"
                min={0}
                step={0.5}
                defaultValue={room.hourlyRate}
                required
                className="w-full rounded-full bg-surface-variant px-4 py-2"
              />
              <div className="flex flex-wrap gap-2">
                {ASSIGNMENT_AMENITIES.map((a) => (
                  <label key={a} className="flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      name={`amenity-${a}`}
                      defaultChecked={room.amenities?.includes(a)}
                    />
                    {a}
                  </label>
                ))}
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="flex-1 rounded-full border py-2 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-full bg-primary py-2 font-black text-on-primary"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {deleteOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6">
            <p className="mb-4 font-medium text-on-surface">
              Delete this room permanently?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDeleteOpen(false)}
                className="flex-1 rounded-full border py-2 font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="flex-1 rounded-full bg-red-600 py-2 font-black text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
