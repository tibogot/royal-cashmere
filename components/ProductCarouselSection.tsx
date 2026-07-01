import FeaturedProductsCarousel from "@/components/FeaturedProductsCarousel";
import type { ShopifyProduct } from "@/lib/shopify/queries";

type ProductCarouselSectionProps = {
  title: string;
  products: ShopifyProduct[];
  showViewAll?: boolean;
};

export default function ProductCarouselSection({
  title,
  products,
  showViewAll = false,
}: ProductCarouselSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="bg-white px-4 pt-6 pb-20 text-black md:px-8 md:pt-10 md:pb-32">
      <h2 className="mb-10 font-serif text-2xl uppercase md:mb-12 md:text-3xl">
        {title}
      </h2>
      <FeaturedProductsCarousel
        products={products}
        showViewAll={showViewAll}
      />
    </section>
  );
}
