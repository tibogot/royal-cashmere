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
        <h1 className="sr-only">Boutique</h1>

        <Suspense fallback={<div className="h-40" aria-hidden="true" />}>
          <ShopCatalog products={products} />
        </Suspense>
      </section>
    </main>
  );
}
