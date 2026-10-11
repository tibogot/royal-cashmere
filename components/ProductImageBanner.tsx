import FadeInImage from "@/components/FadeInImage";
import Link from "next/link";
import ProductImageWishlist from "@/components/ProductImageWishlist";
import { ctaLinkClassName } from "@/lib/ui";
import type { ShopifyProduct } from "@/lib/shopify/queries";

type ProductImageBannerProps = {
  product: ShopifyProduct;
  imageSrc: string;
  imageAlt?: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
};

export default function ProductImageBanner({
  product,
  imageSrc,
  imageAlt,
  eyebrow,
  title,
  description,
  ctaLabel,
}: ProductImageBannerProps) {
  return (
    <div className="relative h-svh w-full">
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
          className="object-cover"
          sizes="100vw"
        />
      </ProductImageWishlist>

      <div className="absolute inset-x-0 bottom-0 z-10 bg-linear-to-t from-black/50 to-transparent px-4 pt-4 pb-12 text-left text-white md:px-8 md:pt-8 md:pb-20">
        <p className="mb-4 font-sans text-sm font-medium uppercase">{eyebrow}</p>
        <h2 className="max-w-3xl font-serif text-2xl uppercase leading-[1.1] md:text-4xl">
          {title}
        </h2>
        <p className="mt-6 max-w-xl font-serif text-base leading-relaxed text-white/80 md:text-lg">
          {description}
        </p>
        <Link
          href={`/products/${product.handle}`}
          className={`${ctaLinkClassName} mt-8 inline-block text-white!`}
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
