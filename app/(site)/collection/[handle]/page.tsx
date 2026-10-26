import Breadcrumbs, { type BreadcrumbItem } from "@/components/Breadcrumbs";
import ShopCatalog, { type CategoryLink } from "@/components/ShopCatalog";
import type { CatalogNavSection } from "@/lib/catalog";
import { ALL_PRODUCTS_HANDLE } from "@/lib/collection-handles";
import { routes } from "@/lib/routes";
import { createPageMetadata } from "@/lib/seo";
import {
  getCatalogNav,
  getCollectionPageData,
  getListedCollectionHandles,
  type CollectionPageData,
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
        "Découvrez toute la collection Royal Cashmere : pulls, gilets, robes, pantalons et accessoires en pur cachemire de Mongolie, pour femme et homme. Boutique de cachemire d'exception à Uccle, Bruxelles.",
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
    description:
      collection.description ??
      `Découvrez la collection ${collection.title} Royal Cashmere : pièces en cachemire d'exception.`,
    path: routes.collectionByHandle(handle),
  });
}

export async function generateStaticParams() {
  const handles = await getListedCollectionHandles();

  return [ALL_PRODUCTS_HANDLE, ...handles].map((handle) => ({ handle }));
}

function getBreadcrumbItems(collection: CollectionPageData): BreadcrumbItem[] {
  const { catalog } = collection;
  if (!catalog) {
    return [
      {
        label: collection.title,
        href: routes.collectionByHandle(collection.handle),
      },
    ];
  }

  const items = [
    {
      label: catalog.section.label,
      href: routes.collectionByHandle(catalog.section.handle),
    },
  ];

  if (catalog.collection) {
    items.push({
      label: catalog.collection.label,
      href: routes.collectionByHandle(catalog.collection.handle),
    });
  }

  return items;
}

// The shop links to the sections, and each section's pages to their
// siblings; merchandising collections (Soldes, Bestsellers…) stand on their
// own.
function getCategoryLinks(
  collection: CollectionPageData,
  sections: CatalogNavSection[],
): CategoryLink[] {
  if (collection.handle === ALL_PRODUCTS_HANDLE) {
    return [
      { label: "Tout", href: routes.shop, active: true },
      ...sections.map((section) => ({
        label: section.label,
        href: routes.collectionByHandle(section.handle),
        active: false,
      })),
    ];
  }

  const sectionHandle = collection.catalog?.section.handle;
  const section = sections.find((item) => item.handle === sectionHandle);
  if (!section) return [];

  return [
    {
      label: "Tout",
      href: routes.collectionByHandle(section.handle),
      active: collection.handle === section.handle,
    },
    ...section.children.map((child) => ({
      label: child.label,
      href: routes.collectionByHandle(child.handle),
      active: child.handle === collection.handle,
    })),
  ];
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { handle } = await params;
  const [collection, sections] = await Promise.all([
    getCollectionPageData(handle),
    getCatalogNav(),
  ]);

  if (!collection) {
    notFound();
  }

  return (
    <main className="w-full">
      <section className="bg-white px-4 pt-24 pb-20 text-black md:px-8 md:pt-28 md:pb-32">
        <Breadcrumbs items={getBreadcrumbItems(collection)} className="mb-6" />

        <h1 className="font-serif text-xl uppercase leading-[1.12] md:text-2xl md:leading-[1.08]">
          {collection.title}
        </h1>

        {collection.intro ? (
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-black/60">
            {collection.intro}
          </p>
        ) : null}

        <Suspense fallback={<div className="mt-12 h-40" aria-hidden="true" />}>
          <ShopCatalog
            products={collection.products}
            categoryLinks={getCategoryLinks(collection, sections)}
          />
        </Suspense>
      </section>
    </main>
  );
}
