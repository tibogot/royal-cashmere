import ProductShowcaseCard from "@/components/ProductShowcaseCard";
import { getFeaturedProducts } from "@/lib/shopify/products";

const showcaseImages = [
  "/images/Frame 53.jpg",
  "/images/Frame 54.jpg",
  "/images/Frame 55.jpg",
];

export default async function ProductShowcase() {
  const products = (await getFeaturedProducts(3)).slice(0, 3);

  return (
    <section className="grid w-full grid-cols-1 md:grid-cols-3">
      {products.map((product, index) => (
        <ProductShowcaseCard
          key={product.id}
          product={{
            ...product,
            imageUrl: showcaseImages[index] ?? product.imageUrl,
          }}
        />
      ))}
    </section>
  );
}
