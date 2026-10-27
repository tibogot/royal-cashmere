import FadeInImage from "@/components/FadeInImage";
import Link from "next/link";
import ProductImageWishlist from "@/components/ProductImageWishlist";
import ScrollShrinkImage from "@/components/ScrollShrinkImage";
import type { EditableImageProps } from "@/lib/sanity/image";
import { ctaLinkClassName } from "@/lib/ui";
import type { ShopifyProduct } from "@/lib/shopify/queries";

type ProductImageBannerProps = {
  product: ShopifyProduct;
  image: EditableImageProps;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
};

export default function ProductImageBanner({
  product,
  image,
  eyebrow,
  title,
  description,
  ctaLabel,
}: ProductImageBannerProps) {
  return (
    <div className="relative h-svh w-full">
      <ProductImageWishlist
        product={product}
        className="absolute inset-0 overflow-hidden"
        heartClassName="absolute top-4 right-4 z-10 md:top-6 md:right-6"
        tone="light"
      >
        <ScrollShrinkImage reveal>
          <FadeInImage
            {...image}
            loading="eager"
            fetchPriority="low"
            fill
            className="object-cover"
            sizes="100vw"
          />
          {/* Inside the clipped layer so it reveals with the image. */}
          <div className="absolute inset-0 bg-linear-to-b from-black/50 to-transparent" />
        </ScrollShrinkImage>
      </ProductImageWishlist>

      {/* Text layer covers the section; the text inside is sticky, so it
          starts at the top and stays pinned while the section scrolls past. */}
      <div className="pointer-events-none absolute inset-0 z-10 p-4 text-left text-white md:p-8">
        <div className="pointer-events-auto sticky top-24 w-fit">
          <p className="mb-4 font-sans text-sm font-medium uppercase">{eyebrow}</p>
          <h2 className="max-w-3xl font-serif text-2xl leading-[1.1] md:text-4xl">
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
    </div>
  );
}
