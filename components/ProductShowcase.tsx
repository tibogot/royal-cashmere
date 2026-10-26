import CollectionCarouselCard from "@/components/CollectionCarouselCard";
import { getCatalogNav } from "@/lib/shopify/collections";

const SHOWCASE_COLLECTION_COUNT = 3;

// One card per catalog section (Femme, Homme, Accessoires).
export default async function ProductShowcase() {
  const sections = (await getCatalogNav()).slice(0, SHOWCASE_COLLECTION_COUNT);

  if (sections.length === 0) return null;

  return (
    <section className="bg-white px-4 py-16 md:px-8 md:py-20">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
        {sections.map((section) => (
          <CollectionCarouselCard
            key={section.handle}
            collection={{
              id: section.handle,
              title: section.label,
              handle: section.handle,
              imageUrl: section.image,
              imageAlt: section.imageAlt,
            }}
            className="w-full min-w-0"
            overlay
            imageSizes="(max-width: 768px) 100vw, 33vw"
          />
        ))}
      </div>
    </section>
  );
}
