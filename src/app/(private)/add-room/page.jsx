import AddRoomForm from "@/components/rooms/AddRoomForm";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata(
  "Add Room",
  "List your study room on StudyNook for others to book.",
);

export default function AddRoomPage() {
  return <AddRoomForm />;
}
