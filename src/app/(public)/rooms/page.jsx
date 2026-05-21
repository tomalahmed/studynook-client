import RoomsBrowse from "@/components/rooms/RoomsBrowse";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata(
  "Available Rooms",
  "Browse, search, and filter study rooms available on StudyNook.",
);

export default function RoomsPage() {
  return <RoomsBrowse />;
}
