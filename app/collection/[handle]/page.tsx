import ShopCatalog from "@/components/ShopCatalog";
import { getCollectionLabel, collectionHandles } from "@/lib/categories";
import { createPageMetadata } from "@/lib/seo";
import { getAllProducts } from "@/lib/shopify/products";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type CollectionPageProps = {
  params: Promise<{
    handle: string;
  }>;
};

export async function generateMetadata({ params }: CollectionPageProps) {
  const { handle } = await params;
  const label = getCollectionLabel(handle);

  if (!label) {
    return createPageMetadata({
      title: "Collection",
      path: `/collection/${handle}`,
    });
  }

  return createPageMetadata({
    title: label,
    description: `Découvrez la collection ${label} Royal Cashmere : pièces en cachemire d'exception.`,
    path: `/collection/${handle}`,
  });
}

export function generateStaticParams() {
  return collectionHandles.map((handle) => ({ handle }));
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { handle } = await params;
  const label = getCollectionLabel(handle);

  if (!label) {
    notFound();
  }

  const products = await getAllProducts();

  return (
    <main className="w-full">
      <section className="bg-white px-4 pt-32 pb-20 text-black md:px-8 md:pt-40 md:pb-32">
        <h1 className="mx-auto max-w-5xl text-center font-serif text-5xl uppercase leading-[1.12] md:max-w-6xl md:text-8xl md:leading-[1.08]">
          {label}
        </h1>

        <Suspense fallback={<div className="mt-12 h-40" aria-hidden="true" />}>
          <ShopCatalog products={products} initialFilterId={handle} />
        </Suspense>
      </section>
    </main>
  );
}
