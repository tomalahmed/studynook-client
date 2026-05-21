"use client";

import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { roomsApi } from "@/lib/api";
import { ASSIGNMENT_AMENITIES } from "@/lib/roomConstants";
import RoomCard from "@/components/rooms/RoomCard";
import PageLoader from "@/components/ui/PageLoader";

export default function RoomsBrowse() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [minRate, setMinRate] = useState("");
  const [maxRate, setMaxRate] = useState("");

  const loadRooms = useCallback(async () => {
    setLoading(true);
    try {
      const data = await roomsApi.list({
        search: search.trim() || undefined,
        amenities: selectedAmenities.length ? selectedAmenities : undefined,
        minRate: minRate || undefined,
        maxRate: maxRate || undefined,
      });
      setRooms(data.rooms ?? []);
    } catch {
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, [search, selectedAmenities, minRate, maxRate]);

  useEffect(() => {
    const timer = setTimeout(loadRooms, 300);
    return () => clearTimeout(timer);
  }, [loadRooms]);

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((current) =>
      current.includes(amenity)
        ? current.filter((a) => a !== amenity)
        : [...current, amenity],
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-10 text-center">
        <h1 className="mb-3 text-4xl font-black text-on-surface md:text-5xl">
          Study Rooms
        </h1>
        <p className="text-lg text-on-surface-variant">
          Find your perfect learning sanctuary.
        </p>
      </div>

      <div className="mb-8 space-y-4 rounded-xl bg-white p-6 candy-shadow-secondary">
        <div className="relative">
          <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#907898]" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by room name..."
            className="w-full rounded-full border-none bg-surface-variant py-3 pr-4 pl-12 text-on-surface outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <p className="mb-2 text-sm font-bold text-on-surface-variant">Amenities</p>
          <div className="flex flex-wrap gap-2">
            {ASSIGNMENT_AMENITIES.map((amenity) => (
              <label
                key={amenity}
                className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                  selectedAmenities.includes(amenity)
                    ? "bg-primary text-on-primary"
                    : "bg-surface-variant text-on-surface-variant"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={selectedAmenities.includes(amenity)}
                  onChange={() => toggleAmenity(amenity)}
                />
                {amenity}
              </label>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:max-w-md">
          <input
            type="number"
            min="0"
            step="0.5"
            value={minRate}
            onChange={(e) => setMinRate(e.target.value)}
            placeholder="Min $/hr"
            className="rounded-full bg-surface-variant px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="number"
            min="0"
            step="0.5"
            value={maxRate}
            onChange={(e) => setMaxRate(e.target.value)}
            placeholder="Max $/hr"
            className="rounded-full bg-surface-variant px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {loading ? (
        <PageLoader label="Loading rooms" minHeight="min-h-[320px]" />
      ) : rooms.length === 0 ? (
        <p className="rounded-xl bg-white py-16 text-center text-lg font-medium text-on-surface-variant candy-shadow-secondary">
          No rooms found. Try adjusting your search or filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
}
