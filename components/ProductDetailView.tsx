import ProductDetailClient from "@/components/ProductDetailClient";
import type { ShopifyProductDetail } from "@/lib/shopify/queries";

type ProductDetailViewProps = {
  product: ShopifyProductDetail;
};

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  return <ProductDetailClient product={product} />;
}
