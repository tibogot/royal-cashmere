import ShopCatalog from "@/components/ShopCatalog";
import { createPageMetadata } from "@/lib/seo";
import { getAllProducts } from "@/lib/shopify/products";
import { Suspense } from "react";

export const metadata = createPageMetadata({
  title: "Boutique",
  description:
    "Découvrez toute la collection Royal Cashmere : pulls, robes, pantalons et écharpes en pur cachemire de Mongolie. Boutique de cachemire d'exception à Uccle, Bruxelles.",
  path: "/boutique",
});

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <main className="w-full">
      <section className="bg-white px-4 pt-32 pb-20 text-black md:px-8 md:pt-40 md:pb-32">
        <h1 className="mx-auto max-w-5xl text-center font-serif text-5xl uppercase leading-[1.12] md:max-w-6xl md:text-8xl md:leading-[1.08]">
          Boutique
        </h1>

        <Suspense fallback={<div className="mt-12 h-40" aria-hidden="true" />}>
          <ShopCatalog products={products} />
        </Suspense>
      </section>
    </main>
  );
}
