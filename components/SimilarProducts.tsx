import ProductCarouselSection from "@/components/ProductCarouselSection";
import type { Locale } from "@/lib/i18n/config";
import { getSimilarProducts } from "@/lib/shopify/products";
import type { ShopifyProductDetail } from "@/lib/shopify/queries";

type SimilarProductsProps = {
  product: ShopifyProductDetail;
  locale: Locale;
  title: string;
};

export default async function SimilarProducts({
  product,
  locale,
  title,
}: SimilarProductsProps) {
  const products = await getSimilarProducts(product, locale, 4);

  return (
    <ProductCarouselSection title={title} products={products} />
  );
}
