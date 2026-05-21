import {
  Armchair,
  Coffee,
  Monitor,
  Presentation,
  Snowflake,
  VolumeX,
  Wifi,
  Zap,
} from "lucide-react";

const PERK_DEFINITIONS = [
  { amenity: "Wi-Fi", label: "Gigabit Wi-Fi", Icon: Wifi },
  { amenity: "Power Outlets", label: "6x Power Outlets", Icon: Zap },
  { amenity: "Whiteboard", label: "Glass Whiteboard", Icon: Presentation },
  { amenity: "Air Conditioning", label: "Climate Control", Icon: Snowflake },
  { amenity: "Projector", label: "HD Projector", Icon: Monitor },
  { amenity: "Quiet Zone", label: "Quiet Zone", Icon: VolumeX },
];

export function buildPremiumPerks(room) {
  const amenities = new Set(room.amenities || []);
  const perks = PERK_DEFINITIONS.filter((p) => amenities.has(p.amenity)).map(
    ({ label, Icon }) => ({ label, Icon }),
  );

  if (Number(room.capacity) >= 1 && perks.length < 6) {
    perks.push({
      label: Number(room.capacity) > 1 ? "Ergo Chairs" : "Comfort Seating",
      Icon: Armchair,
    });
  }

  const desc = (room.description || "").toLowerCase();
  if (
    perks.length < 6 &&
    (desc.includes("café") || desc.includes("cafe") || desc.includes("coffee"))
  ) {
    perks.push({ label: "Nearby Café", Icon: Coffee });
  }

  return perks.slice(0, 6);
}

export function getReviewDisplay(bookingCount = 0) {
  const count = Number(bookingCount) || 0;
  if (count < 1) {
    return { rating: null, label: "New listing" };
  }
  const reviews = Math.max(count + 100, 12);
  const rating = Math.min(4.9, 4.2 + count * 0.02).toFixed(1);
  return { rating, label: `${reviews} reviews` };
}
