import CollectionsSection from "@/components/CollectionsSection";
import { createPageMetadata } from "@/lib/seo";
import { getCollections } from "@/lib/shopify/collections";

export const metadata = createPageMetadata({
  title: "Collections",
  description:
    "Explorez les collections Royal Cashmere : robes, pulls, pantalons et Ã©charpes en pur cachemire de Mongolie.",
  path: "/collection",
});

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <main className="w-full">
      <section className="bg-white px-4 pt-24 pb-20 text-black md:px-8 md:pt-28 md:pb-32">
        <CollectionsSection collections={collections} />
      </section>
    </main>
  );
}
