import MyFavoritesView from "@/components/rooms/MyFavoritesView";
import { FadeIn } from "@/components/ui/FadeIn";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata(
  "My Favorites",
  "Your saved study rooms on StudyNook.",
);

export default function MyFavoritesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <FadeIn className="mb-8 text-center sm:mb-10">
        <h1 className="mb-3 text-3xl font-black text-primary sm:text-4xl md:text-5xl">
          My Favorites
        </h1>
        <p className="mx-auto max-w-lg text-base text-on-surface-variant sm:text-lg">
          Study rooms you have saved for later.
        </p>
      </FadeIn>
      <MyFavoritesView />
    </div>
  );
}
