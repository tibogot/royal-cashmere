import WishlistView from "@/components/WishlistView";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Wishlist",
  description:
    "Votre sélection Royal Cashmere. Retrouvez vos pièces en cachemire favorites.",
  path: "/wishlist",
});

export default function WishlistPage() {
  return (
    <main className="flex w-full flex-1 flex-col">
      <section className="flex-1 bg-white px-4 pt-32 pb-20 text-black md:px-8 md:pt-40 md:pb-32">
        <h1 className="text-center font-serif text-5xl uppercase leading-[1.12] md:text-7xl">
          Wishlist
        </h1>

        <WishlistView />
      </section>
    </main>
  );
}
