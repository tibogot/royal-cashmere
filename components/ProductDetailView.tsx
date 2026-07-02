import ProductDetailClient from "@/components/ProductDetailClient";
import type { ShopifyProductDetail } from "@/lib/shopify/queries";

type ProductDetailViewProps = {
  product: ShopifyProductDetail;
  initialColor?: string;
};

export default function ProductDetailView({
  product,
  initialColor,
}: ProductDetailViewProps) {
  return (
    <ProductDetailClient product={product} initialColor={initialColor} />
  );
}
