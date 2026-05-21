"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { roomsApi } from "@/lib/api";
import {
  FLOOR_FILTERS,
  LIBRARY_BRANCHES,
  ROOM_TYPES,
} from "@/lib/roomConstants";
import BrowseRoomCard from "@/components/rooms/BrowseRoomCard";
import PageLoader from "@/components/ui/PageLoader";

function FilterChip({ active, onClick, children, activeClass = "bg-primary text-on-primary candy-shadow-primary" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
        active
          ? activeClass
          : "bg-white text-on-surface-variant hover:bg-primary-container"
      }`}
    >
      {children}
    </button>
  );
}

export default function RoomsBrowse() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("");
  const [roomType, setRoomType] = useState("");
  const [capacityMin, setCapacityMin] = useState(1);
  const [floor, setFloor] = useState("");

  const loadRooms = useCallback(async () => {
    setLoading(true);
    try {
      const data = await roomsApi.list({
        search: search.trim() || undefined,
        libraryBranch: branch || undefined,
        roomType: roomType || undefined,
        minCapacity: capacityMin > 1 ? capacityMin : undefined,
        floor: floor || undefined,
      });
      setRooms(data.rooms ?? []);
    } catch {
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, [search, branch, roomType, capacityMin, floor]);

  useEffect(() => {
    const timer = setTimeout(loadRooms, 300);
    return () => clearTimeout(timer);
  }, [loadRooms]);

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12">
      <div className="mb-12 text-center md:text-left">
        <h1 className="mb-4 text-4xl font-black tracking-tight text-on-surface md:text-5xl">
          Find Your Perfect Study Space
        </h1>
        <p className="max-w-2xl text-lg text-on-surface-variant">
          Discover quiet pods, collaborative hubs, and tech-heavy rooms designed
          to fuel your academic success.
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-72">
          <div className="sticky top-24 rounded-lg bg-surface-container-low p-6 candy-shadow-secondary">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
              <SlidersHorizontal className="h-5 w-5 text-primary" strokeWidth={2.5} />
              Filters
            </h2>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-bold text-on-surface-variant">
                Room Name
              </label>
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-outline" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search rooms..."
                  className="w-full rounded-full border-none bg-surface py-3 pr-4 pl-10 text-sm text-on-surface ring-2 ring-transparent outline-none transition-all focus:ring-primary/30"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-bold text-on-surface-variant">
                Library Branch
              </label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full cursor-pointer appearance-none rounded-full border-none bg-surface px-4 py-3 text-sm text-on-surface ring-2 ring-transparent outline-none transition-all focus:ring-primary/30"
              >
                {LIBRARY_BRANCHES.map((b) => (
                  <option key={b.value || "all"} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="mb-3 block text-sm font-bold text-on-surface-variant">
                Room Type
              </label>
              <div className="flex flex-wrap gap-2">
                <FilterChip active={!roomType} onClick={() => setRoomType("")}>
                  All
                </FilterChip>
                {ROOM_TYPES.map((type) => (
                  <FilterChip
                    key={type.id}
                    active={roomType === type.id}
                    onClick={() => setRoomType(type.id)}
                  >
                    {type.label}
                  </FilterChip>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-bold text-on-surface-variant">
                  Capacity
                </label>
                <span className="rounded-md bg-primary-container px-2 py-1 text-xs font-bold text-primary">
                  {capacityMin} {capacityMin === 1 ? "Person" : "People"}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={capacityMin}
                onChange={(e) => setCapacityMin(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-outline-variant accent-primary"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-bold text-on-surface-variant">
                Floor Preference
              </label>
              <div className="flex flex-wrap gap-2">
                <FilterChip
                  active={!floor}
                  activeClass="bg-secondary text-on-secondary candy-shadow-secondary"
                  onClick={() => setFloor("")}
                >
                  Any
                </FilterChip>
                {FLOOR_FILTERS.map((f) => (
                  <FilterChip
                    key={f.value}
                    active={floor === f.value}
                    activeClass="bg-secondary text-on-secondary candy-shadow-secondary"
                    onClick={() => setFloor(f.value)}
                  >
                    {f.label}
                  </FilterChip>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {loading ? (
            <PageLoader label="Loading rooms" minHeight="min-h-[400px]" />
          ) : rooms.length === 0 ? (
            <p className="rounded-lg bg-surface py-20 text-center text-lg font-medium text-on-surface-variant candy-shadow-secondary">
              No rooms found. Try adjusting your search or filters.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {rooms.map((room) => (
                <BrowseRoomCard key={room.id} room={room} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
