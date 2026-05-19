import Link from "next/link";

export const metadata = {
  title: "My Bookings | StudyNook",
  description: "View and manage your study room bookings",
};

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

      <div className="rounded-xl bg-white p-10 text-center candy-shadow-secondary">
        <p className="text-on-surface-variant">
          No bookings yet. Browse rooms and book your perfect study nook!
        </p>
        <Link
          href="/rooms"
          className="mt-6 inline-flex rounded-full border-2 border-[#dcc8e0] bg-white px-8 py-3 text-sm font-bold text-on-surface transition-transform hover:scale-[1.03] active:scale-95"
        >
          Browse Rooms
        </Link>
      </div>
    </div>
  );
}
