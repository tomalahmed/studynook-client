export const SAMPLE_ROOMS = [
  {
    id: "pink-oasis",
    name: "The Pink Oasis",
    libraryBranch: "Central Library",
    floor: 2,
    capacity: 4,
    roomType: "Quiet Zone",
    pricePerHour: 5.5,
    description:
      "A bright and airy modern study room filled with natural light. Perfect for deep focus sessions with soft pastel accents and ergonomic seating.",
    image: "/images/library.png",
    amenities: ["Wi-Fi", "Power", "AC"],
  },
];

export function getRoomById(id) {
  return SAMPLE_ROOMS.find((room) => room.id === id) ?? null;
}
