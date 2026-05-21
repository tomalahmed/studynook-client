"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Wind,
  Wifi,
  Zap,
  Pencil,
  Monitor,
  MapPin,
} from "lucide-react";
import { formatFloorLabel, getRoomCategory } from "@/lib/roomConstants";
import { isRemoteImage, resolveRoomImage } from "@/lib/images";

const AMENITY_ICONS = {
  "Wi-Fi": Wifi,
  "Power Outlets": Zap,
  Whiteboard: Pencil,
  Projector: Monitor,
  "Air Conditioning": Wind,
  "Quiet Zone": Monitor,
};

function AmenityIcon({ name }) {
  const Icon = AMENITY_ICONS[name] || Monitor;
  return (
    <span title={name} className="text-tertiary">
      <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
    </span>
  );
}

const BADGE_STYLES = {
  primary: "bg-primary text-on-primary candy-shadow-primary",
  tertiary: "bg-tertiary text-on-tertiary candy-shadow-secondary",
  secondary: "bg-secondary text-on-secondary candy-shadow-secondary",
};

export default function BrowseRoomCard({ room }) {
  const imageSrc = resolveRoomImage(room.image);
  const category = getRoomCategory(room);
  const amenities = (room.amenities || []).slice(0, 3);
  const location = `${room.libraryBranch || "Library"} • ${formatFloorLabel(room.floor)}`;

  return (
    <article className="group overflow-hidden rounded-lg border border-transparent bg-surface candy-shadow-secondary transition-all duration-300 ease-out hover:scale-[1.03] hover:border-primary/20">
      <Link
        href={`/rooms/${room.id}`}
        className="relative block h-48 overflow-hidden"
      >
        <Image
          src={imageSrc}
          alt={room.name}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          unoptimized={isRemoteImage(imageSrc)}
        />
        <span
          className={`absolute top-4 left-4 rounded-full px-3 py-1 text-[10px] font-black tracking-widest uppercase ${BADGE_STYLES[category.variant]}`}
        >
          {category.label}
        </span>
        <span className="absolute right-4 bottom-4 rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-secondary backdrop-blur">
          ${Number(room.hourlyRate).toFixed(0)}/hr
        </span>
      </Link>

      <div className="p-6">
        <h3 className="mb-1 text-xl font-bold text-on-surface">{room.name}</h3>
        <p className="mb-4 flex items-center gap-1 text-sm text-on-surface-variant">
          <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
          {location}
        </p>
        <div className="mb-6 flex gap-3">
          {amenities.map((amenity) => (
            <AmenityIcon key={amenity} name={amenity} />
          ))}
        </div>
        <Link
          href={`/rooms/${room.id}`}
          className="block w-full rounded-full bg-secondary py-3 text-center font-bold text-on-secondary candy-shadow-secondary transition-all hover:bg-primary active:scale-95"
        >
          Book Now
        </Link>
      </div>
    </article>
  );
}
