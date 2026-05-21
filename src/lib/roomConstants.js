export const ASSIGNMENT_AMENITIES = [
  "Whiteboard",
  "Projector",
  "Wi-Fi",
  "Power Outlets",
  "Quiet Zone",
  "Air Conditioning",
];

export const AMENITY_ID_TO_API = {
  wifi: "Wi-Fi",
  power: "Power Outlets",
  whiteboard: "Whiteboard",
  monitor: "Projector",
  ac: "Air Conditioning",
};

export const HOUR_OPTIONS = Array.from({ length: 13 }, (_, i) => i + 8);

/** Same values as add-room form and server Room model */
export const LIBRARY_BRANCHES = [
  { value: "", label: "All branches" },
  { value: "Central Library", label: "Central Library" },
  { value: "West Wing Commons", label: "West Wing Commons" },
  { value: "North Heights Archive", label: "North Heights Archive" },
  { value: "The Creative Hub", label: "The Creative Hub" },
];

export const ROOM_TYPES = [
  { id: "quiet", label: "Quiet Zone" },
  { id: "collaborative", label: "Collaborative" },
  { id: "tech-heavy", label: "Tech-heavy" },
];

/** Floor filter values sent to API (maps to stored floors like "3rd Floor") */
export const FLOOR_FILTERS = [
  { value: "1", label: "1st" },
  { value: "2", label: "2nd" },
  { value: "3", label: "3rd" },
];

export function truncateText(text, max = 100) {
  if (!text) return "";
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

export function normalizeFloor(floorInput) {
  const trimmed = String(floorInput ?? "").trim();
  if (!trimmed) return "";
  if (/floor/i.test(trimmed)) return trimmed;
  const digits = trimmed.replace(/\D/g, "");
  if (digits) {
    const n = Number.parseInt(digits, 10);
    if (Number.isFinite(n)) {
      const suffix =
        n % 10 === 1 && n % 100 !== 11
          ? "st"
          : n % 10 === 2 && n % 100 !== 12
            ? "nd"
            : n % 10 === 3 && n % 100 !== 13
              ? "rd"
              : "th";
      return `${n}${suffix} Floor`;
    }
  }
  return `Floor ${trimmed}`;
}

export function formatFloorLabel(floor) {
  if (floor == null || floor === "") return "";
  const str = String(floor);
  if (/floor/i.test(str)) return str;
  return `Floor ${str}`;
}

export function formatCapacityLabel(capacity) {
  const n = Number(capacity);
  if (!Number.isFinite(n)) return "";
  if (n <= 1) return "1 person";
  return `${n} people`;
}

/** Badge on browse cards — uses stored roomType when present */
export function getRoomCategory(room) {
  const type = ROOM_TYPES.find((t) => t.id === room.roomType);
  if (type) {
    const variant =
      type.id === "quiet"
        ? "primary"
        : type.id === "tech-heavy"
          ? "secondary"
          : "tertiary";
    return { label: type.label, variant };
  }

  const amenities = room.amenities || [];
  if (amenities.includes("Quiet Zone")) {
    return { label: "Quiet Zone", variant: "primary" };
  }
  if (amenities.includes("Projector")) {
    return { label: "Tech-heavy", variant: "secondary" };
  }
  return { label: "Collaborative", variant: "tertiary" };
}

export function amenityChips(amenities = [], maxVisible = 3) {
  const list = amenities.filter(Boolean);
  const visible = list.slice(0, maxVisible);
  const extra = list.length - visible.length;
  return { visible, extra };
}
