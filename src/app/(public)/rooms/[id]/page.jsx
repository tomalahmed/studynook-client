import { notFound } from "next/navigation";
import RoomDetails from "@/components/rooms/RoomDetails";
import { getRoomById } from "@/lib/rooms";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const room = getRoomById(id);

  return {
    title: room ? `${room.name} | StudyNook` : "Room | StudyNook",
    description: room?.description ?? "View study room details on StudyNook",
  };
}

export default async function RoomDetailsPage({ params }) {
  const { id } = await params;
  const room = getRoomById(id);

  if (!room) {
    notFound();
  }

  return <RoomDetails room={room} />;
}
