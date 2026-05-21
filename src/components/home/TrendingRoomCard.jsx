import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { formatFloorLabel } from "@/lib/roomConstants";
import { isRemoteImage, resolveRoomImage } from "@/lib/images";
import { getReviewDisplay } from "@/lib/roomPerks";
import { roomDetails } from "@/lib/routes";

const ACCENTS = [
  {
    shadow: "candy-shadow-primary",
    text: "text-primary",
    button: "bg-primary text-on-primary",
  },
  {
    shadow: "candy-shadow-secondary",
    text: "text-secondary",
    button: "bg-secondary text-on-primary",
  },
  {
    shadow: "candy-shadow-tertiary",
    text: "text-tertiary",
    button: "bg-tertiary text-on-primary",
  },
];

function formatLocation(room) {
  const branch = room.libraryBranch || "Library";
  const floor = formatFloorLabel(room.floor);
  return floor ? `${branch}, ${floor}` : branch;
}

export default function TrendingRoomCard({ room, index = 0, showPopularBadge = false }) {
  const accent = ACCENTS[index % ACCENTS.length];
  const imageSrc = resolveRoomImage(room.image);
  const { rating } = getReviewDisplay(room.bookingCount);
  const displayRating = rating ?? "New";
  const rate = Number(room.hourlyRate);

  return (
    <article
      className={`group overflow-hidden rounded-lg bg-white ${accent.shadow} transition-all duration-300 hover:scale-[1.02]`}
    >
      <Link href={roomDetails(room.id)} className="relative block h-64">
        <Image
          src={imageSrc}
          alt={room.name}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover"
          unoptimized={isRemoteImage(imageSrc)}
        />
        {showPopularBadge ? (
          <span className="absolute top-4 left-4 rounded-full bg-primary px-3 py-1 text-xs font-bold tracking-wider text-on-primary uppercase">
            Most Popular
          </span>
        ) : null}
      </Link>

      <div className="p-6">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h4 className="text-xl font-bold text-on-surface">{room.name}</h4>
          <div className={`flex shrink-0 items-center gap-0.5 font-bold ${accent.text}`}>
            <Star className="h-[18px] w-[18px] fill-current" strokeWidth={0} aria-hidden />
            <span>{displayRating}</span>
          </div>
        </div>

        <p className="mb-6 flex items-center gap-1 text-sm text-on-surface-variant">
          <MapPin className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
          {formatLocation(room)}
        </p>

        <div className="flex items-center justify-between gap-4">
          <span className={`text-xl font-black ${accent.text}`}>
            ${Number.isFinite(rate) ? rate.toFixed(0) : "—"}
            <span className="text-xs font-medium text-on-surface-variant">/hr</span>
          </span>
          <Link
            href={roomDetails(room.id)}
            className={`rounded-full px-6 py-2 text-sm font-bold transition-all active:scale-95 ${accent.button}`}
          >
            Book Now
          </Link>
        </div>
      </div>
    </article>
  );
}
