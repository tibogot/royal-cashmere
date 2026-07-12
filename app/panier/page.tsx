import CartPageClient from "@/components/CartPageClient";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Panier",
  description:
    "Votre panier Royal Cashmere. Finalisez votre commande de pièces en cachemire d'exception.",
  path: "/panier",
});

export default function CartPage() {
  return (
    <main className="w-full">
      <section className="bg-white px-4 pt-24 pb-20 text-black md:px-8 md:pt-28 md:pb-32">
        <h1 className="text-center font-serif text-5xl uppercase leading-[1.12] md:text-7xl">
          Panier
        </h1>

        <CartPageClient />
      </section>
    </main>
  );
}
