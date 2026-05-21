"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  CalendarX2,
  Clock,
  DollarSign,
  MapPin,
  Search,
} from "lucide-react";
import { bookingsApi } from "@/lib/api";
import { isRemoteImage, resolveRoomImage } from "@/lib/images";
import PageLoader from "@/components/ui/PageLoader";
import { FadeIn, FadeInItem, FadeInStagger } from "@/components/ui/FadeIn";
import { roomDetails, ROUTES } from "@/lib/routes";

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

function bookingDateOnly(dateStr) {
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isUpcoming(booking) {
  if (booking.status !== "confirmed") {
    return false;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return bookingDateOnly(booking.date) >= today;
}

const STATUS_STYLES = {
  confirmed: "bg-tertiary-container text-on-tertiary-container",
  cancelled: "bg-primary-container text-on-primary-container",
};

function BookingCard({ booking, onCancel }) {
  const image = resolveRoomImage(booking.room?.image);
  const duration = booking.endHour - booking.startHour;

  return (
    <FadeInItem>
      <motion.article
        layout
        className="overflow-hidden rounded-2xl border border-[#dcc8e0]/60 bg-white candy-shadow-secondary transition-shadow hover:shadow-[0_12px_32px_rgba(124,82,170,0.14)]"
      >
        <div className="flex flex-col sm:flex-row">
          {booking.room?.id ? (
            <Link
              href={roomDetails(booking.room.id)}
              className="relative aspect-[16/10] w-full shrink-0 bg-surface-variant sm:aspect-auto sm:h-auto sm:w-36 md:w-44"
            >
              <Image
                src={image}
                alt={booking.room?.name || "Room"}
                fill
                sizes="(max-width: 640px) 100vw, 176px"
                className="object-cover transition-transform duration-500 hover:scale-105"
                unoptimized={isRemoteImage(image)}
              />
            </Link>
          ) : (
            <div className="relative aspect-[16/10] w-full shrink-0 bg-surface-variant sm:aspect-auto sm:w-36 md:w-44">
              <Image
                src={image}
                alt={booking.room?.name || "Room"}
                fill
                className="object-cover"
                unoptimized={isRemoteImage(image)}
              />
            </div>
          )}

          <div className="flex min-w-0 flex-1 flex-col gap-4 p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                {booking.room?.id ? (
                  <Link
                    href={roomDetails(booking.room.id)}
                    className="line-clamp-1 text-lg font-black text-on-surface transition-colors hover:text-primary"
                  >
                    {booking.room?.name || "Study room"}
                  </Link>
                ) : (
                  <h2 className="line-clamp-1 text-lg font-black text-on-surface">
                    {booking.room?.name || "Study room"}
                  </h2>
                )}
                <p className="mt-1 flex items-center gap-1 text-sm text-on-surface-variant">
                  <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
                  <span className="line-clamp-1">
                    {booking.room?.libraryBranch || "Library"}
                  </span>
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-black capitalize ${
                  STATUS_STYLES[booking.status] ?? STATUS_STYLES.confirmed
                }`}
              >
                {booking.status}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
              <div className="flex items-center gap-2 rounded-xl bg-surface-container-low px-3 py-2">
                <Calendar className="h-4 w-4 shrink-0 text-primary" strokeWidth={2.5} />
                <span className="font-medium text-on-surface">{formatDate(booking.date)}</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-surface-container-low px-3 py-2">
                <Clock className="h-4 w-4 shrink-0 text-secondary" strokeWidth={2.5} />
                <span className="font-medium text-on-surface">
                  {formatHour(booking.startHour)} – {formatHour(booking.endHour)}
                  <span className="text-on-surface-variant"> ({duration}h)</span>
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-surface-container-low px-3 py-2">
                <DollarSign className="h-4 w-4 shrink-0 text-tertiary" strokeWidth={2.5} />
                <span className="font-black text-primary">
                  ${Number(booking.totalCost).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#dcc8e0]/50 pt-4">
              {booking.room?.id ? (
                <Link
                  href={roomDetails(booking.room.id)}
                  className="text-sm font-bold text-secondary transition-colors hover:text-primary"
                >
                  View room details →
                </Link>
              ) : (
                <span />
              )}
              {booking.canCancel ? (
                <button
                  type="button"
                  onClick={() => onCancel(booking.id)}
                  className="rounded-full border-2 border-[#dcc8e0] px-4 py-2 text-sm font-bold text-[#c41e5a] transition-all hover:border-[#c41e5a]/40 hover:bg-[#ffe8e8] active:scale-95"
                >
                  Cancel booking
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </motion.article>
    </FadeInItem>
  );
}

function CancelModal({ onClose, onConfirm }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#2e1a28]/45 p-4 backdrop-blur-sm sm:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 candy-shadow-secondary sm:rounded-3xl"
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.96 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="cancel-title" className="text-xl font-black text-on-surface">
          Cancel this booking?
        </h3>
        <p className="mt-2 text-sm text-on-surface-variant">
          This action cannot be undone. The time slot will become available again.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border-2 border-[#dcc8e0] px-6 py-2.5 text-sm font-bold text-on-surface transition-colors hover:bg-surface-variant"
          >
            Keep booking
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-[#c41e5a] px-6 py-2.5 text-sm font-black text-white transition-transform hover:scale-[1.02] active:scale-95"
          >
            Yes, cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function MyBookingsView() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelId, setCancelId] = useState(null);
  const [tab, setTab] = useState("upcoming");

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

  const { upcoming, past } = useMemo(() => {
    const up = [];
    const pa = [];
    for (const b of bookings) {
      if (isUpcoming(b)) {
        up.push(b);
      } else {
        pa.push(b);
      }
    }
    return { upcoming: up, past: pa };
  }, [bookings]);

  const displayed = tab === "upcoming" ? upcoming : past;

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
    return <PageLoader label="Loading your bookings" minHeight="min-h-[320px]" />;
  }

  if (bookings.length === 0) {
    return (
      <FadeIn className="rounded-2xl bg-white px-6 py-14 text-center candy-shadow-secondary sm:px-10">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-container text-primary">
          <CalendarX2 className="h-8 w-8" strokeWidth={2} />
        </div>
        <h2 className="text-xl font-black text-on-surface">No bookings yet</h2>
        <p className="mx-auto mt-2 max-w-sm text-on-surface-variant">
          Browse study rooms and reserve your perfect quiet space.
        </p>
        <Link
          href={ROUTES.rooms}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-black text-on-primary candy-shadow-primary transition-transform hover:scale-[1.03] active:scale-95"
        >
          <Search className="h-4 w-4" strokeWidth={2.5} />
          Browse Rooms
        </Link>
      </FadeIn>
    );
  }

  return (
    <>
      <FadeIn className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex rounded-full bg-surface-container-low p-1 candy-shadow-secondary">
          {[
            { id: "upcoming", label: "Upcoming", count: upcoming.length },
            { id: "past", label: "Past", count: past.length },
          ].map(({ id, label, count }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-all sm:flex-none sm:px-6 ${
                tab === id
                  ? "bg-primary text-on-primary candy-shadow-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {label}
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  tab === id ? "bg-white/25" : "bg-white text-on-surface-variant"
                }`}
              >
                {count}
              </span>
            </button>
          ))}
        </div>
        <p className="text-sm font-medium text-on-surface-variant">
          {bookings.length} total booking{bookings.length === 1 ? "" : "s"}
        </p>
      </FadeIn>

      {displayed.length === 0 ? (
        <FadeIn className="rounded-2xl bg-white px-6 py-12 text-center candy-shadow-secondary">
          <p className="text-on-surface-variant">
            {tab === "upcoming"
              ? "No upcoming bookings. Explore rooms to plan your next session."
              : "No past bookings yet."}
          </p>
          {tab === "upcoming" ? (
            <Link
              href={ROUTES.rooms}
              className="mt-6 inline-flex rounded-full bg-secondary px-6 py-2.5 text-sm font-bold text-on-secondary transition-transform hover:scale-[1.02] active:scale-95"
            >
              Find a room
            </Link>
          ) : null}
        </FadeIn>
      ) : (
        <FadeInStagger className="space-y-4">
          {displayed.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={setCancelId}
            />
          ))}
        </FadeInStagger>
      )}

      <AnimatePresence>
        {cancelId ? (
          <CancelModal
            onClose={() => setCancelId(null)}
            onConfirm={() => handleCancel(cancelId)}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
