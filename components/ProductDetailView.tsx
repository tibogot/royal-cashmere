import ProductPurchasePanel from "@/components/ProductPurchasePanel";
import type { ShopifyProductDetail } from "@/lib/shopify/queries";
import Image from "next/image";

type ProductDetailViewProps = {
  product: ShopifyProductDetail;
};

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  return (
    <section className="flex min-h-svh flex-col overflow-x-hidden bg-white text-black md:flex-row">
      <div className="relative h-[55svh] w-full shrink-0 md:h-auto md:min-h-svh md:w-1/2">
        <Image
          src={product.imageUrl}
          alt={product.imageAlt}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      <div className="flex min-w-0 w-full flex-col justify-center overflow-x-hidden px-4 py-12 md:w-1/2 md:px-12 md:py-24 lg:px-20">
        <ProductPurchasePanel product={product} />
      </div>
    </section>
  );
}
