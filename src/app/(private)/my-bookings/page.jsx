import MyBookingsView from "@/components/rooms/MyBookingsView";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata(
  "My Bookings",
  "View and manage your study room bookings on StudyNook.",
);

export default function MyBookingsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-8 text-center">
        <h1 className="mb-3 text-4xl font-black text-primary md:text-5xl">
          My Bookings
        </h1>
        <p className="text-lg text-on-surface-variant">
          Upcoming and past study sessions you have reserved.
        </p>
      </div>
      <MyBookingsView />
    </div>
  );
}
