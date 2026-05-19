import Image from "next/image";
import Link from "next/link";
import { SAMPLE_ROOMS } from "@/lib/rooms";

export const metadata = {
  title: "Study Rooms | StudyNook",
  description: "Browse and book study rooms",
};

export default function RoomsPage() {
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

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {SAMPLE_ROOMS.map((room) => (
          <Link
            key={room.id}
            href={`/rooms/${room.id}`}
            className="group overflow-hidden rounded-xl border-8 border-white bg-white candy-shadow-secondary transition-transform hover:-translate-y-1"
          >
            <div className="relative aspect-video bg-surface-variant">
              <Image
                src={room.image}
                alt={room.name}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover transition-transform group-hover:scale-[1.02]"
              />
              <div className="absolute top-3 right-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-on-primary">
                ${room.pricePerHour.toFixed(2)}/hr
              </div>
            </div>
            <div className="p-5">
              <h2 className="text-xl font-black text-on-surface">{room.name}</h2>
              <p className="mt-1 text-sm text-on-surface-variant">
                {room.libraryBranch} · Floor {room.floor}
              </p>
              <span className="mt-3 inline-block rounded-full bg-secondary-container px-3 py-1 text-xs font-bold text-on-secondary-container">
                {room.roomType}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
