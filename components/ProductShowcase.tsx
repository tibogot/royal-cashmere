import CollectionCarouselCard from "@/components/CollectionCarouselCard";
import { getCollections } from "@/lib/shopify/collections";

const SHOWCASE_COLLECTION_COUNT = 3;

export default async function ProductShowcase() {
  const collections = (await getCollections()).slice(0, SHOWCASE_COLLECTION_COUNT);

  if (collections.length === 0) return null;

  return (
    <section className="bg-white px-4 py-16 md:px-8 md:py-20">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
        {collections.map((collection) => (
          <CollectionCarouselCard
            key={collection.id}
            collection={collection}
            className="w-full min-w-0"
            imageSizes="(max-width: 768px) 100vw, 33vw"
          />
        ))}
      </div>
    </section>
  );
}
