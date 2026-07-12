import {
  isShopifyCdnUrl,
  shopifyImageUrl,
  SHOPIFY_IMAGE_WIDTH,
} from "@/lib/shopify/image";
import { routes } from "@/lib/routes";
import type { ShopifyCollection } from "@/lib/shopify/queries";
import { Draggable } from "gsap/Draggable";
import FadeInImage from "@/components/FadeInImage";
import Link from "next/link";

export const collectionCarouselCardWidthClass =
  "w-[78vw] shrink-0 sm:w-88 md:w-96 lg:w-md xl:w-lg";

type CollectionCarouselCardProps = {
  collection: ShopifyCollection;
  preventClickAfterDrag?: boolean;
  className?: string;
  imageSizes?: string;
};

export default function CollectionCarouselCard({
  collection,
  preventClickAfterDrag = false,
  className = collectionCarouselCardWidthClass,
  imageSizes = "(max-width: 640px) 78vw, (max-width: 1024px) 352px, 512px",
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
        <div className="order-1 mb-3 md:order-2 md:mb-0 md:mt-4">
          <h3 className="text-left font-serif text-xl font-medium text-black md:text-2xl">
            {collection.title}
          </h3>

          <span className="animated-underline mt-2 hidden w-fit text-xs uppercase tracking-wide text-black group-hover:block md:mt-3">
            Découvrir
          </span>
        </div>

        <div className="relative order-2 aspect-3/4 overflow-hidden md:order-1">
          <FadeInImage
            src={resolvedSrc}
            alt={collection.imageAlt ?? collection.title}
            fill
            unoptimized={isShopifyCdnUrl(imageUrl)}
            className="object-cover group-hover:opacity-95"
            sizes={imageSizes}
          />
        </div>
      </Link>
    </article>
  );
}
