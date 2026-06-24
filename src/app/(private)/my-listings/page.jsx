import MyListingsView from "@/components/rooms/MyListingsView";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata(
  "My Listings",
  "Manage study rooms you have listed on StudyNook.",
);

export default function MyListingsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-8 text-center">
        <h1 className="mb-3 text-4xl font-black text-primary md:text-5xl">
          My Listings
        </h1>
        <p className="text-lg text-on-surface-variant">
          Rooms you have listed for other students to book.
        </p>
      </div>
      <MyListingsView />
    </div>
  );
}
