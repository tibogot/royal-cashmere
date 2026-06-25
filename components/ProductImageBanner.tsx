import Image from "next/image";
import Link from "next/link";
import type { ShopifyProduct } from "@/lib/shopify/queries";

type ProductImageBannerProps = {
  product: ShopifyProduct;
  imageSrc: string;
  imageAlt?: string;
};

export default function ProductImageBanner({
  product,
  imageSrc,
  imageAlt,
}: ProductImageBannerProps) {
  return (
    <Link
      href={`/products/${product.handle}`}
      className="group relative block h-svh w-full"
    >
      <Image
        src={imageSrc}
        alt={imageAlt ?? product.imageAlt}
        fill
        className="object-cover transition-opacity group-hover:opacity-95"
        sizes="100vw"
      />

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-6 text-left text-white md:p-8">
        <h3 className="font-serif text-base font-medium md:text-lg">{product.title}</h3>
        <p className="mt-1 text-sm text-white/80">{product.price}</p>
      </div>
    </Link>
  );
}
