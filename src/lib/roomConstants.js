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

export function truncateText(text, max = 100) {
  if (!text) return "";
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
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

export function amenityChips(amenities = [], maxVisible = 3) {
  const list = amenities.filter(Boolean);
  const visible = list.slice(0, maxVisible);
  const extra = list.length - visible.length;
  return { visible, extra };
}
