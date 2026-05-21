import Link from "next/link";

export const metadata = {
  title: "StudyNook – About",
  description: "Learn about StudyNook study room booking",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="mb-6 text-4xl font-black text-primary">About StudyNook</h1>
      <p className="mb-4 text-lg leading-relaxed text-on-surface-variant">
        StudyNook helps students and library members list private study rooms,
        discover quiet spaces, and book hourly sessions without double-booking.
      </p>
      <p className="mb-8 text-lg leading-relaxed text-on-surface-variant">
        List your room, set your rate, and let others book when you are not
        using the space — or browse rooms across your library and reserve the
        perfect focus zone.
      </p>
      <Link
        href="/rooms"
        className="inline-flex rounded-full bg-primary px-8 py-3 font-black text-on-primary"
      >
        Explore Rooms
      </Link>
    </div>
  );
}
