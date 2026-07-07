import WishlistView from "@/components/WishlistView";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Wishlist",
  description:
    "Votre sÃ©lection Royal Cashmere. Retrouvez vos piÃ¨ces en cachemire favorites.",
  path: "/wishlist",
});

export default function WishlistPage() {
  return (
    <main className="flex w-full flex-1 flex-col">
      <section className="flex-1 bg-white px-4 pt-24 pb-20 text-black md:px-8 md:pt-28 md:pb-32">
        <h1 className="text-center font-serif text-5xl uppercase leading-[1.12] md:text-7xl">
          Wishlist
        </h1>

        <WishlistView />
      </section>
    </main>
  );
}
