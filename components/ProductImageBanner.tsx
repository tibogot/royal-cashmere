import FadeInImage from "@/components/FadeInImage";
import Link from "next/link";
import ProductImageWishlist from "@/components/ProductImageWishlist";
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
      <ProductImageWishlist
        product={product}
        className="absolute inset-0"
        heartClassName="absolute top-4 right-4 z-10 md:top-6 md:right-6"
        tone="light"
      >
        <FadeInImage
          src={imageSrc}
          alt={imageAlt ?? product.imageAlt}
          fill
          className="object-cover group-hover:opacity-95"
          sizes="100vw"
        />
      </ProductImageWishlist>

      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/50 to-transparent p-6 text-left text-white md:p-8">
        <h3 className="font-serif text-base font-medium md:text-lg">{product.title}</h3>
        <p className="mt-1 text-sm text-white/80">{product.price}</p>
      </div>
    </Link>
  );
}
