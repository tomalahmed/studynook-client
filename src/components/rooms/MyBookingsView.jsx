"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { bookingsApi } from "@/lib/api";

function formatHour(h) {
  return `${String(h).padStart(2, "0")}:00`;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function MyBookingsView() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelId, setCancelId] = useState(null);

  const load = () => {
    setLoading(true);
    bookingsApi
      .mine()
      .then((data) => setBookings(data.bookings ?? []))
      .catch((err) => {
        toast.error(err.message || "Could not load bookings.");
        setBookings([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCancel = async (id) => {
    try {
      await bookingsApi.cancel(id);
      toast.success("Booking cancelled");
      setCancelId(null);
      load();
    } catch (err) {
      toast.error(err.message || "Could not cancel booking.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="rounded-xl bg-white p-10 text-center candy-shadow-secondary">
        <p className="text-on-surface-variant">You have no bookings yet.</p>
        <Link
          href="/rooms"
          className="mt-6 inline-flex rounded-full border-2 border-[#dcc8e0] bg-white px-8 py-3 text-sm font-bold text-on-surface"
        >
          Browse Rooms
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {bookings.map((booking) => {
          const image =
            booking.room?.image?.startsWith("http") ||
            booking.room?.image?.startsWith("/")
              ? booking.room.image
              : "/images/library.png";

          return (
            <article
              key={booking.id}
              className="flex flex-col gap-4 rounded-xl bg-white p-4 candy-shadow-secondary sm:flex-row sm:items-center"
            >
              <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-lg bg-surface-variant sm:h-20 sm:w-32">
                <Image
                  src={image}
                  alt={booking.room?.name || "Room"}
                  fill
                  className="object-cover"
                  unoptimized={image.startsWith("http")}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-black text-on-surface">
                  {booking.room?.name || "Study room"}
                </h2>
                <p className="text-sm text-on-surface-variant">
                  {formatDate(booking.date)} · {formatHour(booking.startHour)} –{" "}
                  {formatHour(booking.endHour)}
                </p>
                <p className="text-sm font-bold text-primary">
                  ${Number(booking.totalCost).toFixed(2)}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    booking.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {booking.status}
                </span>
                {booking.canCancel ? (
                  <button
                    type="button"
                    onClick={() => setCancelId(booking.id)}
                    className="text-sm font-bold text-red-600 hover:underline"
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>

      {cancelId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6">
            <p className="mb-4 font-medium">Cancel this booking?</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCancelId(null)}
                className="flex-1 rounded-full border py-2 font-bold"
              >
                Keep
              </button>
              <button
                type="button"
                onClick={() => handleCancel(cancelId)}
                className="flex-1 rounded-full bg-red-600 py-2 font-black text-white"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
