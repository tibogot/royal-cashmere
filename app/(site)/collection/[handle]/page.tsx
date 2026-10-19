import ShopCatalog, { type CategoryLink } from "@/components/ShopCatalog";
import {
  ALL_PRODUCTS_HANDLE,
  isCategoryHandle,
} from "@/lib/collection-handles";
import { routes } from "@/lib/routes";
import { createPageMetadata } from "@/lib/seo";
import {
  getCategoryCollections,
  getCollectionPageData,
  getCollections,
} from "@/lib/shopify/collections";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type CollectionPageProps = {
  params: Promise<{
    handle: string;
  }>;
};

export async function generateMetadata({ params }: CollectionPageProps) {
  const { handle } = await params;

  if (handle === ALL_PRODUCTS_HANDLE) {
    return createPageMetadata({
      title: "Boutique",
      description:
        "Découvrez toute la collection Royal Cashmere : pulls, robes, pantalons et écharpes en pur cachemire de Mongolie. Boutique de cachemire d'exception à Uccle, Bruxelles.",
      path: routes.shop,
    });
  }

  const collection = await getCollectionPageData(handle);

  if (!collection) {
    return createPageMetadata({
      title: "Collection",
      path: routes.collectionByHandle(handle),
    });
  }

  return createPageMetadata({
    title: collection.title,
    description: `Découvrez la collection ${collection.title} Royal Cashmere : pièces en cachemire d'exception.`,
    path: routes.collectionByHandle(handle),
  });
}

export async function generateStaticParams() {
  const collections = await getCollections();

  return [
    { handle: ALL_PRODUCTS_HANDLE },
    ...collections.map((collection) => ({ handle: collection.handle })),
  ];
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { handle } = await params;
  const [collection, categories] = await Promise.all([
    getCollectionPageData(handle),
    getCategoryCollections(),
  ]);

  if (!collection) {
    notFound();
  }

  // The shop and category pages link to each other; merchandising
  // collections (Soldes, Bestsellers…) stand on their own.
  const categoryLinks: CategoryLink[] = isCategoryHandle(handle)
    ? [
        {
          label: "Tout",
          href: routes.shop,
          active: handle === ALL_PRODUCTS_HANDLE,
        },
        ...categories.map((category) => ({
          label: category.title,
          href: routes.collectionByHandle(category.handle),
          active: category.handle === handle,
        })),
      ]
    : [];

  return (
    <main className="w-full">
      <section className="bg-white px-4 pt-24 pb-20 text-black md:px-8 md:pt-28 md:pb-32">
        <h1 className="font-serif text-xl uppercase leading-[1.12] md:text-2xl md:leading-[1.08]">
          {collection.title}
        </h1>

        <Suspense fallback={<div className="mt-12 h-40" aria-hidden="true" />}>
          <ShopCatalog
            products={collection.products}
            categoryLinks={categoryLinks}
          />
        </Suspense>
      </section>
    </main>
  );
}
