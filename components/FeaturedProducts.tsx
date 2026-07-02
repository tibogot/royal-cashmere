import FeaturedProductsCarousel from "@/components/FeaturedProductsCarousel";
import { getFeaturedProducts } from "@/lib/shopify/products";

type FeaturedProductsProps = {
  limit?: number;
  offset?: number;
};

export default async function FeaturedProducts({
  limit = 12,
  offset = 0,
}: FeaturedProductsProps) {
  const products = (await getFeaturedProducts(limit + offset)).slice(
    offset,
    offset + limit,
  );

  return (
    <section className="bg-white px-4 pt-6 pb-20 text-black md:px-8 md:pt-10 md:pb-32">
      <FeaturedProductsCarousel products={products} uppercaseSerifTitles />
    </section>
  );
}
