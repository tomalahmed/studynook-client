import Link from "next/link";

export const metadata = {
  title: "My Listings | StudyNook",
  description: "Manage your listed study rooms",
};

export default function MyListingsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-8 text-center">
        <h1 className="mb-3 text-4xl font-black text-primary md:text-5xl">
          My Listings
        </h1>
        <p className="text-lg text-on-surface-variant">
          Rooms you have listed for other students to book.
        </p>
      </div>

      <div className="rounded-xl bg-white p-10 text-center candy-shadow-secondary">
        <p className="mb-6 text-on-surface-variant">
          You have not listed any rooms yet. Share your study space with the
          community!
        </p>
        <Link
          href="/add-room"
          className="inline-flex rounded-full bg-primary px-8 py-3 text-sm font-black text-on-primary candy-shadow-primary transition-transform hover:scale-[1.03] active:scale-95"
        >
          Add Your First Room
        </Link>
      </div>
    </div>
  );
}
