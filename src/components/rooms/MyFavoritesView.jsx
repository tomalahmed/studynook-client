"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { roomsApi } from "@/lib/api";
import {
  FAVORITES_CHANGED_EVENT,
  getFavoriteIds,
  removeFavorite,
} from "@/lib/favorites";
import { formatFloorLabel } from "@/lib/roomConstants";
import { isRemoteImage, resolveRoomImage } from "@/lib/images";
import { roomDetails, ROUTES } from "@/lib/routes";
import PageLoader from "@/components/ui/PageLoader";
import { FadeIn, FadeInItem, FadeInStagger } from "@/components/ui/FadeIn";

function FavoriteRoomRow({ room, onRemove }) {
  const imageSrc = resolveRoomImage(room.image);
  const location = `${room.libraryBranch || "Library"} · ${formatFloorLabel(room.floor)}`;
  const rate = Number(room.hourlyRate);

  return (
    <FadeInItem>
      <article className="overflow-hidden rounded-2xl border border-[#dcc8e0]/60 bg-white candy-shadow-secondary">
        <div className="flex flex-col sm:flex-row">
          <Link
            href={roomDetails(room.id)}
            className="relative block aspect-video w-full shrink-0 sm:aspect-auto sm:h-36 sm:w-44 md:w-52"
          >
            <Image
              src={imageSrc}
              alt={room.name}
              fill
              sizes="(max-width: 640px) 100vw, 208px"
              className="object-cover"
              unoptimized={isRemoteImage(imageSrc)}
            />
          </Link>

          <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 p-5 sm:p-6">
            <div className="min-w-0">
              <Link
                href={roomDetails(room.id)}
                className="line-clamp-1 text-lg font-black text-on-surface transition-colors hover:text-primary"
              >
                {room.name}
              </Link>
              <p className="mt-1 flex items-center gap-1 text-sm text-on-surface-variant">
                <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
                <span className="line-clamp-1">{location}</span>
              </p>
              {room.description ? (
                <p className="mt-2 line-clamp-2 text-sm text-on-surface-variant">
                  {room.description}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#dcc8e0]/50 pt-4">
              <p className="text-lg font-black text-primary">
                ${Number.isFinite(rate) ? rate.toFixed(2) : "—"}
                <span className="text-sm font-bold text-on-surface-variant"> / hr</span>
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={roomDetails(room.id)}
                  className="rounded-full bg-primary px-5 py-2 text-sm font-black text-on-primary transition-transform hover:scale-[1.02]"
                >
                  View & book
                </Link>
                <button
                  type="button"
                  onClick={() => onRemove(room.id)}
                  className="flex items-center gap-1.5 rounded-full border-2 border-secondary px-4 py-2 text-sm font-bold text-secondary transition-colors hover:bg-secondary-container"
                >
                  <Heart className="h-4 w-4 fill-secondary" strokeWidth={2.5} />
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </FadeInItem>
  );
}

export default function MyFavoritesView() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    const ids = getFavoriteIds();

    if (ids.length === 0) {
      setRooms([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const results = await Promise.all(
        ids.map(async (id) => {
          try {
            const data = await roomsApi.get(id);
            return data.room;
          } catch {
            removeFavorite(id);
            return null;
          }
        }),
      );

      const loaded = results.filter(Boolean);
      const order = new Map(ids.map((id, index) => [id, index]));
      loaded.sort(
        (a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0),
      );
      setRooms(loaded);
    } catch (err) {
      toast.error(err.message || "Could not load favorites.");
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  useEffect(() => {
    function handleChange() {
      loadFavorites();
    }

    window.addEventListener(FAVORITES_CHANGED_EVENT, handleChange);
    window.addEventListener("storage", handleChange);
    return () => {
      window.removeEventListener(FAVORITES_CHANGED_EVENT, handleChange);
      window.removeEventListener("storage", handleChange);
    };
  }, [loadFavorites]);

  const handleRemove = (roomId) => {
    removeFavorite(roomId);
    setRooms((current) => current.filter((room) => room.id !== String(roomId)));
    toast.success("Removed from favorites");
  };

  if (loading) {
    return <PageLoader label="Loading your favorites" minHeight="min-h-[280px]" />;
  }

  if (rooms.length === 0) {
    return (
      <FadeIn>
        <div className="rounded-xl bg-white p-10 text-center candy-shadow-secondary">
          <Heart
            className="mx-auto mb-4 h-12 w-12 text-secondary"
            strokeWidth={1.75}
            aria-hidden
          />
          <p className="mb-6 text-on-surface-variant">
            You have not saved any study rooms yet. Tap the heart on a room
            details page to add it here.
          </p>
          <Link
            href={ROUTES.rooms}
            className="inline-flex rounded-full bg-primary px-8 py-3 text-sm font-black text-on-primary candy-shadow-primary transition-transform hover:scale-[1.03]"
          >
            Browse rooms
          </Link>
        </div>
      </FadeIn>
    );
  }

  return (
    <FadeInStagger className="space-y-4">
      {rooms.map((room) => (
        <FavoriteRoomRow key={room.id} room={room} onRemove={handleRemove} />
      ))}
    </FadeInStagger>
  );
}
