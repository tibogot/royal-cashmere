import AddToCartButton from "@/components/AddToCartButton";
import type { ShopifyProductDetail } from "@/lib/shopify/queries";
import Image from "next/image";

type ProductDetailViewProps = {
  product: ShopifyProductDetail;
};

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  return (
    <section className="flex min-h-svh flex-col bg-white text-black md:flex-row">
      <div className="relative h-[55svh] w-full md:h-svh md:w-1/2">
        <Image
          src={product.imageUrl}
          alt={product.imageAlt}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      <div className="flex w-full flex-col justify-center px-4 py-12 md:w-1/2 md:px-12 md:py-24 lg:px-20">
        <h1 className="font-serif text-3xl uppercase leading-tight md:text-5xl">
          {product.title}
        </h1>

        <p className="mt-6 text-lg text-black/80 md:mt-8 md:text-xl">
          {product.price}
        </p>

        <AddToCartButton
          variantId={product.variantId}
          availableForSale={product.availableForSale}
        />
      </div>
    </section>
  );
}
