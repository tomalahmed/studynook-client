"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { bookingsApi } from "@/lib/api";
import { HOUR_OPTIONS } from "@/lib/roomConstants";

function formatHour(h) {
  return `${String(h).padStart(2, "0")}:00`;
}

export default function BookingModal({ room, open, onClose, onSuccess }) {
  const [date, setDate] = useState("");
  const [startHour, setStartHour] = useState(9);
  const [endHour, setEndHour] = useState(10);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const endOptions = HOUR_OPTIONS.filter((h) => h > startHour && h <= 21);

  const totalCost = useMemo(() => {
    const hours = endHour - startHour;
    if (hours <= 0) return 0;
    return hours * Number(room.hourlyRate);
  }, [endHour, startHour, room.hourlyRate]);

  if (!open) return null;

  const minDate = new Date().toISOString().slice(0, 10);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) {
      toast.error("Please select a date.");
      return;
    }

    setSubmitting(true);
    try {
      await bookingsApi.create({
        roomId: room.id,
        date,
        startHour,
        endHour,
        note,
      });
      toast.success("Room booked successfully!");
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.message || "Could not complete booking.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
    >
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 candy-shadow-secondary">
        <h2 id="booking-title" className="mb-4 text-xl font-black text-on-surface">
          Book {room.name}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-bold text-on-surface-variant">
              Date
            </label>
            <input
              type="date"
              required
              min={minDate}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-full bg-surface-variant px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-bold text-on-surface-variant">
                Start
              </label>
              <select
                value={startHour}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  setStartHour(next);
                  if (endHour <= next) setEndHour(next + 1);
                }}
                className="w-full rounded-full bg-surface-variant px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
              >
                {HOUR_OPTIONS.filter((h) => h <= 20).map((h) => (
                  <option key={h} value={h}>
                    {formatHour(h)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-on-surface-variant">
                End
              </label>
              <select
                value={endHour}
                onChange={(e) => setEndHour(Number(e.target.value))}
                className="w-full rounded-full bg-surface-variant px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
              >
                {endOptions.map((h) => (
                  <option key={h} value={h}>
                    {formatHour(h)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-center text-lg font-black text-primary">
            Total: ${totalCost.toFixed(2)}
          </p>
          <div>
            <label className="mb-1 block text-sm font-bold text-on-surface-variant">
              Special note (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="w-full resize-none rounded-2xl bg-surface-variant px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border-2 border-[#dcc8e0] py-3 font-bold text-on-surface"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-full bg-primary py-3 font-black text-on-primary disabled:opacity-70"
            >
              {submitting ? "Booking…" : "Confirm Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
