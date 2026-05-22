"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, Heart, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { bookingsApi } from "@/lib/api";
import { HOUR_OPTIONS } from "@/lib/roomConstants";
import {
  FAVORITES_CHANGED_EVENT,
  isFavorite,
  toggleFavorite,
} from "@/lib/favorites";
import { loginUrl, roomDetails } from "@/lib/routes";

const BOOKING_FEE = 0.5;

function formatHour12(hour) {
  if (hour === 0) return "12:00 AM";
  if (hour < 12) return `${String(hour).padStart(2, "0")}:00 AM`;
  if (hour === 12) return "12:00 PM";
  return `${String(hour - 12).padStart(2, "0")}:00 PM`;
}

export default function RoomBookingSidebar({
  room,
  isAuthenticated,
  isPending,
  onSuccess,
}) {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [startHour, setStartHour] = useState(9);
  const [endHour, setEndHour] = useState(11);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isFavorite(room.id));

    function syncSaved() {
      setSaved(isFavorite(room.id));
    }

    window.addEventListener(FAVORITES_CHANGED_EVENT, syncSaved);
    window.addEventListener("storage", syncSaved);
    return () => {
      window.removeEventListener(FAVORITES_CHANGED_EVENT, syncSaved);
      window.removeEventListener("storage", syncSaved);
    };
  }, [room.id]);

  const hourlyRate = Number(room.hourlyRate) || 0;
  const endOptions = HOUR_OPTIONS.filter((h) => h > startHour && h <= 21);
  const hours = Math.max(0, endHour - startHour);
  const subtotal = hours * hourlyRate;
  const total = subtotal + BOOKING_FEE;

  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isPending) return;

    if (!isAuthenticated) {
      router.push(loginUrl(roomDetails(room.id)));
      return;
    }

    if (!date) {
      toast.error("Please select a session date.");
      return;
    }

    setSubmitting(true);
    try {
      await bookingsApi.create({
        roomId: room.id,
        date,
        startHour,
        endHour,
        note: "",
      });
      toast.success("Room booked successfully!");
      onSuccess?.();
    } catch (err) {
      toast.error(err.message || "Could not complete booking.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleFavorite = () => {
    try {
      const nowSaved = toggleFavorite(room.id);
      setSaved(nowSaved);
      toast.success(
        nowSaved ? "Saved to favorites" : "Removed from favorites",
      );
    } catch {
      toast.error("Could not update favorites.");
    }
  };

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-surface p-6 candy-shadow-secondary md:p-8"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <p className="text-3xl font-black text-primary">
            ${hourlyRate.toFixed(2)}
            <span className="text-base font-bold text-on-surface-variant">
              {" "}
              / hr
            </span>
          </p>
          <span className="flex shrink-0 items-center gap-1 text-sm font-bold text-tertiary">
            <Sparkles className="h-4 w-4" strokeWidth={2.5} aria-hidden />
            Instant Book
          </span>
        </div>

        <div className="mb-4">
          <label
            htmlFor="session-date"
            className="mb-2 block text-xs font-black tracking-wider text-on-surface-variant uppercase"
          >
            Session Date
          </label>
          <div className="relative">
            <Calendar
              className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-outline"
              strokeWidth={2}
            />
            <input
              id="session-date"
              type="date"
              required
              min={minDate}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-full border-none bg-surface-variant py-3 pr-4 pl-11 text-sm font-medium text-on-surface outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="start-hour"
              className="mb-2 block text-xs font-black tracking-wider text-on-surface-variant uppercase"
            >
              Start
            </label>
            <select
              id="start-hour"
              value={startHour}
              onChange={(e) => {
                const next = Number(e.target.value);
                setStartHour(next);
                if (endHour <= next) setEndHour(Math.min(next + 1, 21));
              }}
              className="w-full rounded-full border-none bg-surface-variant px-4 py-3 text-sm font-medium text-on-surface outline-none focus:ring-2 focus:ring-primary/30"
            >
              {HOUR_OPTIONS.filter((h) => h <= 20).map((h) => (
                <option key={h} value={h}>
                  {formatHour12(h)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="end-hour"
              className="mb-2 block text-xs font-black tracking-wider text-on-surface-variant uppercase"
            >
              End
            </label>
            <select
              id="end-hour"
              value={endHour}
              onChange={(e) => setEndHour(Number(e.target.value))}
              className="w-full rounded-full border-none bg-surface-variant px-4 py-3 text-sm font-medium text-on-surface outline-none focus:ring-2 focus:ring-primary/30"
            >
              {endOptions.map((h) => (
                <option key={h} value={h}>
                  {formatHour12(h)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending || submitting}
          className="mb-3 w-full rounded-full bg-primary py-4 text-lg font-black text-on-primary candy-shadow-primary transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
        >
          {submitting
            ? "Booking…"
            : isAuthenticated
              ? "Book This Nook"
              : "Login to Book"}
        </button>

        <button
          type="button"
          onClick={handleToggleFavorite}
          aria-pressed={saved}
          className={`mb-6 flex w-full items-center justify-center gap-2 rounded-full border-2 py-3 text-sm font-bold transition-colors ${
            saved
              ? "border-secondary bg-secondary-container text-secondary"
              : "border-secondary text-secondary hover:bg-secondary-container"
          }`}
        >
          <Heart
            className={`h-4 w-4 ${saved ? "fill-secondary" : ""}`}
            strokeWidth={2.5}
            aria-hidden
          />
          {saved ? "Remove from Favorites" : "Save to Favorites"}
        </button>

        <div className="space-y-2 border-t border-outline-variant/40 pt-4 text-sm">
          <div className="flex justify-between text-on-surface-variant">
            <span>
              {hours} {hours === 1 ? "hour" : "hours"} × ${hourlyRate.toFixed(2)}
            </span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-on-surface-variant">
            <span>Booking fee</span>
            <span className="font-medium">${BOOKING_FEE.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-1 text-base font-black">
            <span className="text-on-surface">Total</span>
            <span className="text-primary">${total.toFixed(2)}</span>
          </div>
        </div>

        <p className="mt-4 text-center text-xs leading-relaxed text-on-surface-variant">
          You won&apos;t be charged yet. Cancellation is free up to 2 hours
          before.
        </p>

        {!isAuthenticated && !isPending ? (
          <p className="mt-3 text-center text-xs font-medium text-on-surface-variant">
            <Link href={loginUrl(roomDetails(room.id))} className="text-primary hover:underline">
              Sign in
            </Link>{" "}
            to complete your booking.
          </p>
        ) : null}
      </form>
    </aside>
  );
}
