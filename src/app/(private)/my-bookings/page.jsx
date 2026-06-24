import MyBookingsView from "@/components/rooms/MyBookingsView";
import { FadeIn } from "@/components/ui/FadeIn";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata(
  "My Bookings",
  "View and manage your study room bookings on StudyNook.",
);

export default function MyBookingsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <FadeIn className="mb-8 text-center sm:mb-10">
        <h1 className="mb-3 text-3xl font-black text-primary sm:text-4xl md:text-5xl">
          My Bookings
        </h1>
        <p className="mx-auto max-w-lg text-base text-on-surface-variant sm:text-lg">
          Upcoming and past study sessions you have reserved.
        </p>
      </FadeIn>
      <MyBookingsView />
    </div>
  );
}
