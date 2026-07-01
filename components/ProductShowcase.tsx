import CollectionShowcaseCard from "@/components/CollectionShowcaseCard";
import { getCollections } from "@/lib/shopify/collections";

const SHOWCASE_COLLECTION_COUNT = 3;

export default async function ProductShowcase() {
  const collections = (await getCollections()).slice(0, SHOWCASE_COLLECTION_COUNT);

  if (collections.length === 0) return null;

  return (
    <section className="grid w-full grid-cols-1 md:grid-cols-3">
      {collections.map((collection) => (
        <CollectionShowcaseCard key={collection.id} collection={collection} />
      ))}
    </section>
  );
}
