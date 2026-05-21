"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { roomsApi } from "@/lib/api";
import {
  FLOOR_FILTERS,
  LIBRARY_BRANCHES,
  ROOM_TYPES,
} from "@/lib/roomConstants";
import BrowseRoomCard from "@/components/rooms/BrowseRoomCard";
import PageLoader from "@/components/ui/PageLoader";
import { FadeIn, FadeInItem, FadeInStagger } from "@/components/ui/FadeIn";

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

const DEFAULT_FILTERS = {
  search: "",
  branch: "",
  roomType: "",
  capacityMin: 1,
  floor: "",
};

export default function RoomsBrowse() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(DEFAULT_FILTERS.search);
  const [searchDebounced, setSearchDebounced] = useState(DEFAULT_FILTERS.search);
  const [branch, setBranch] = useState(DEFAULT_FILTERS.branch);
  const [roomType, setRoomType] = useState(DEFAULT_FILTERS.roomType);
  const [capacityMin, setCapacityMin] = useState(DEFAULT_FILTERS.capacityMin);
  const [floor, setFloor] = useState(DEFAULT_FILTERS.floor);

  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounced(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const hasActiveFilters = useMemo(
    () =>
      Boolean(searchDebounced.trim()) ||
      Boolean(branch) ||
      Boolean(roomType) ||
      capacityMin > 1 ||
      Boolean(floor),
    [searchDebounced, branch, roomType, capacityMin, floor],
  );

  const loadRooms = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await roomsApi.list({
        search: searchDebounced.trim() || undefined,
        libraryBranch: branch || undefined,
        roomType: roomType || undefined,
        minCapacity: capacityMin > 1 ? capacityMin : undefined,
        floor: floor || undefined,
      });
      setRooms(data.rooms ?? []);
    } catch (err) {
      setRooms([]);
      setError(err?.message || "Could not load rooms. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [searchDebounced, branch, roomType, capacityMin, floor]);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  function clearFilters() {
    setSearch(DEFAULT_FILTERS.search);
    setSearchDebounced(DEFAULT_FILTERS.search);
    setBranch(DEFAULT_FILTERS.branch);
    setRoomType(DEFAULT_FILTERS.roomType);
    setCapacityMin(DEFAULT_FILTERS.capacityMin);
    setFloor(DEFAULT_FILTERS.floor);
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12">
      <FadeIn className="mb-12 text-center md:text-left">
        <h1 className="mb-4 text-4xl font-black tracking-tight text-on-surface md:text-5xl">
          Find Your Perfect Study Space
        </h1>
        <p className="max-w-2xl text-lg text-on-surface-variant">
          Discover quiet pods, collaborative hubs, and tech-heavy rooms designed
          to fuel your academic success.
        </p>
      </FadeIn>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-72">
          <div className="sticky top-24 rounded-lg bg-surface-container-low p-6 candy-shadow-secondary">
            <div className="mb-6 flex items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <SlidersHorizontal className="h-5 w-5 text-primary" strokeWidth={2.5} />
                Filters
              </h2>
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-primary-container"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                  Clear
                </button>
              ) : null}
            </div>

            <div className="mb-6">
              <label htmlFor="room-search" className="mb-2 block text-sm font-bold text-on-surface-variant">
                Room Name
              </label>
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-outline" />
                <input
                  id="room-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, branch, or floor..."
                  className="w-full rounded-full border-none bg-surface py-3 pr-4 pl-10 text-sm text-on-surface ring-2 ring-transparent outline-none transition-all focus:ring-primary/30"
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="library-branch" className="mb-2 block text-sm font-bold text-on-surface-variant">
                Library Branch
              </label>
              <select
                id="library-branch"
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
              <span className="mb-3 block text-sm font-bold text-on-surface-variant">
                Room Type
              </span>
              <div className="flex flex-wrap gap-2">
                <FilterChip active={!roomType} onClick={() => setRoomType("")}>
                  All
                </FilterChip>
                {ROOM_TYPES.map((type) => (
                  <FilterChip
                    key={type.id}
                    active={roomType === type.id}
                    onClick={() => setRoomType(roomType === type.id ? "" : type.id)}
                  >
                    {type.label}
                  </FilterChip>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="capacity-min" className="text-sm font-bold text-on-surface-variant">
                  Minimum Capacity
                </label>
                <span className="rounded-md bg-primary-container px-2 py-1 text-xs font-bold text-primary">
                  {capacityMin}+ {capacityMin === 1 ? "person" : "people"}
                </span>
              </div>
              <input
                id="capacity-min"
                type="range"
                min={1}
                max={10}
                value={capacityMin}
                onChange={(e) => setCapacityMin(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-outline-variant accent-primary"
              />
            </div>

            <div>
              <span className="mb-3 block text-sm font-bold text-on-surface-variant">
                Floor Preference
              </span>
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
                    onClick={() => setFloor(floor === f.value ? "" : f.value)}
                  >
                    {f.label}
                  </FilterChip>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {!loading ? (
            <p className="mb-4 text-sm font-medium text-on-surface-variant">
              {rooms.length === 0
                ? "No rooms match your filters"
                : `${rooms.length} room${rooms.length === 1 ? "" : "s"} found`}
            </p>
          ) : null}

          {loading ? (
            <PageLoader label="Loading rooms" minHeight="min-h-[400px]" />
          ) : error ? (
            <p className="rounded-lg bg-primary-container px-6 py-12 text-center text-lg font-medium text-on-primary-container candy-shadow-secondary">
              {error}
            </p>
          ) : rooms.length === 0 ? (
            <p className="rounded-lg bg-surface py-20 text-center text-lg font-medium text-on-surface-variant candy-shadow-secondary">
              No rooms found. Try adjusting your search or filters.
              {hasActiveFilters ? (
                <>
                  {" "}
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="font-bold text-primary underline-offset-2 hover:underline"
                  >
                    Clear all filters
                  </button>
                </>
              ) : null}
            </p>
          ) : (
            <FadeInStagger className="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {rooms.map((room) => (
                <FadeInItem key={room.id}>
                  <BrowseRoomCard room={room} />
                </FadeInItem>
              ))}
            </FadeInStagger>
          )}
        </div>
      </div>
    </div>
  );
}
