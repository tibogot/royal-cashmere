import FeaturedProductsCarousel from "@/components/FeaturedProductsCarousel";
import { getFeaturedProducts } from "@/lib/shopify/products";
import type { ShopifyProduct } from "@/lib/shopify/queries";

type FeaturedProductsProps = {
  limit?: number;
  offset?: number;
  // Pass an already-fetched product list to avoid a duplicate Shopify request
  // when several instances render on the same page (e.g. the homepage).
  products?: ShopifyProduct[];
};

export default async function FeaturedProducts({
  limit = 12,
  offset = 0,
  products: providedProducts,
}: FeaturedProductsProps) {
  const source =
    providedProducts ?? (await getFeaturedProducts(limit + offset));
  const products = source.slice(offset, offset + limit);

  return (
    <section className="bg-white px-4 pt-6 pb-20 text-black md:px-8 md:pt-10 md:pb-32">
      <FeaturedProductsCarousel products={products} />
    </section>
  );
}
