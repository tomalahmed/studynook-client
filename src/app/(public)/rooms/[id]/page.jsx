import { notFound } from "next/navigation";
import RoomDetails from "@/components/rooms/RoomDetails";
import { fetchRoomById } from "@/lib/api-server";
import { pageTitle } from "@/lib/site";
import { resolveRoomImage } from "@/lib/images";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const room = await fetchRoomById(id);

  if (!room) {
    return {
      title: pageTitle("Room"),
      description: "View study room details on StudyNook",
    };
  }

  const image = resolveRoomImage(room.image);

  return {
    title: pageTitle(room.name),
    description: room.description || `Book ${room.name} on StudyNook`,
    openGraph: {
      title: pageTitle(room.name),
      description: room.description,
      images: image.startsWith("http") ? [{ url: image }] : [{ url: image }],
    },
  };
}

export default async function RoomDetailsPage({ params }) {
  const { id } = await params;
  const room = await fetchRoomById(id);

  if (!room) {
    notFound();
  }

  return <RoomDetails room={room} />;
}
