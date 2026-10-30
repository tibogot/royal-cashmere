import {
  isShopifyCdnUrl,
  shopifyImageUrl,
  SHOPIFY_IMAGE_WIDTH,
} from "@/lib/shopify/image";
import { routes } from "@/lib/routes";
import { ctaLinkClassName } from "@/lib/ui";
import type { ShopifyCollection } from "@/lib/shopify/queries";
import { Draggable } from "gsap/Draggable";
import FadeInImage from "@/components/FadeInImage";
import ScrollShrinkImage from "@/components/ScrollShrinkImage";
import Link from "@/components/LocaleLink";

export const collectionCarouselCardWidthClass =
  "w-[78vw] shrink-0 sm:w-88 md:w-96 lg:w-md xl:w-lg";

type CollectionCarouselCardProps = {
  collection: ShopifyCollection;
  // "Découvrir" in the page's language. A prop rather than useDictionary:
  // this card also renders as a Server Component (ProductShowcase).
  ctaLabel: string;
  preventClickAfterDrag?: boolean;
  className?: string;
  imageSizes?: string;
  // Title and CTA sit on the image, bottom-centre, instead of beside it.
  overlay?: boolean;
};

export default function CollectionCarouselCard({
  collection,
  ctaLabel,
  preventClickAfterDrag = false,
  className = collectionCarouselCardWidthClass,
  imageSizes = "(max-width: 640px) 78vw, (max-width: 1024px) 352px, 512px",
  overlay = false,
}: CollectionCarouselCardProps) {
  const imageUrl = collection.imageUrl ?? "";
  const resolvedSrc = shopifyImageUrl(imageUrl, SHOPIFY_IMAGE_WIDTH.card);

  const handleLinkClick = preventClickAfterDrag
    ? (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (Draggable.timeSinceDrag() < 0.15) {
          event.preventDefault();
        }
      }
    : undefined;

  return (
    <article className={className}>
      <Link
        href={routes.collectionByHandle(collection.handle)}
        className="group flex flex-col"
        onClick={handleLinkClick}
      >
        {!overlay ? (
          <div className="order-1 mb-3 md:order-2 md:mb-0 md:mt-4">
            <h3 className="text-left font-serif text-xl font-medium text-black md:text-2xl">
              {collection.title}
            </h3>

            <span className="animated-underline mt-2 hidden w-fit text-xs uppercase tracking-wide text-black group-hover:block md:mt-3">
              {ctaLabel}
            </span>
          </div>
        ) : null}

        <div className="relative order-2 aspect-3/4 cursor-pointer overflow-hidden md:order-1">
          {overlay ? (
            <ScrollShrinkImage reveal>
              {/* Only the homepage showcase uses overlay cards: start them
                  early at low priority so they're ready by the time they
                  scroll in, like the other editorial images there. */}
              <FadeInImage
                src={resolvedSrc}
                alt={collection.imageAlt ?? collection.title}
                fill
                loading="eager"
                fetchPriority="low"
                unoptimized={isShopifyCdnUrl(imageUrl)}
                className="object-cover group-hover:opacity-95"
                sizes={imageSizes}
              />
            </ScrollShrinkImage>
          ) : (
            <FadeInImage
              src={resolvedSrc}
              alt={collection.imageAlt ?? collection.title}
              fill
              unoptimized={isShopifyCdnUrl(imageUrl)}
              className="object-cover group-hover:opacity-95"
              sizes={imageSizes}
            />
          )}
          {overlay ? (
            <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-6 p-4 text-center md:gap-8 md:p-8">
              <h3 className="font-serif text-4xl uppercase leading-[1.1] text-white xl:text-5xl">
                {collection.title}
              </h3>
              <span className={`${ctaLinkClassName} text-white!`}>
                {ctaLabel}
              </span>
            </div>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
