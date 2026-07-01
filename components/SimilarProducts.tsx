import ProductCarouselSection from "@/components/ProductCarouselSection";
import { getSimilarProducts } from "@/lib/shopify/products";
import type { ShopifyProductDetail } from "@/lib/shopify/queries";

type SimilarProductsProps = {
  product: ShopifyProductDetail;
};

export default async function SimilarProducts({ product }: SimilarProductsProps) {
  const products = await getSimilarProducts(product, 4);

  return (
    <ProductCarouselSection title="Articles similaires" products={products} />
  );
}
