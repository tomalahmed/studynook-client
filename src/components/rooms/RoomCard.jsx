import Image from "next/image";
import Link from "next/link";
import {
  amenityChips,
  formatCapacityLabel,
  formatFloorLabel,
  truncateText,
} from "@/lib/roomConstants";
import { isRemoteImage, resolveRoomImage } from "@/lib/images";

export default function RoomCard({ room }) {
  const { visible, extra } = amenityChips(room.amenities);
  const imageSrc = resolveRoomImage(room.image);

  return (
    <Link
      href={`/rooms/${room.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border-8 border-white bg-white candy-shadow-secondary transition-transform hover:-translate-y-1"
    >
      <div className="relative aspect-video shrink-0 bg-surface-variant">
        <Image
          src={imageSrc}
          alt={room.name}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover transition-transform group-hover:scale-[1.02]"
          unoptimized={isRemoteImage(imageSrc)}
        />
        <div className="absolute top-3 right-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-on-primary">
          ${Number(room.hourlyRate).toFixed(0)}/hr
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h2 className="text-xl font-black text-on-surface">{room.name}</h2>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-on-surface-variant">
          {truncateText(room.description, 100)}
        </p>
        <p className="mt-2 text-sm font-medium text-on-surface-variant">
          {formatFloorLabel(room.floor)} · {formatCapacityLabel(room.capacity)}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {visible.map((amenity) => (
            <span
              key={amenity}
              className="rounded-full bg-[#c8eaff] px-2.5 py-0.5 text-xs font-bold text-tertiary"
            >
              {amenity}
            </span>
          ))}
          {extra > 0 ? (
            <span className="rounded-full bg-surface-variant px-2.5 py-0.5 text-xs font-bold text-on-surface-variant">
              +{extra} more
            </span>
          ) : null}
        </div>
        <span className="mt-4 inline-flex w-fit rounded-full bg-secondary-container px-4 py-2 text-xs font-black text-on-secondary-container">
          View Details
        </span>
      </div>
    </Link>
  );
}
