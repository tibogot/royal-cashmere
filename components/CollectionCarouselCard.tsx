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

type CollectionCarouselCardProps = {
  collection: ShopifyCollection;
  preventClickAfterDrag?: boolean;
};

export default function CollectionCarouselCard({
  collection,
  preventClickAfterDrag = false,
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
    <article className="w-[78vw] shrink-0 sm:w-88 md:w-96 lg:w-md xl:w-lg">
      <Link
        href={routes.collectionByHandle(collection.handle)}
        className="group relative block aspect-3/4 overflow-hidden"
        onClick={handleLinkClick}
      >
        <FadeInImage
          src={resolvedSrc}
          alt={collection.imageAlt ?? collection.title}
          fill
          unoptimized={isShopifyCdnUrl(imageUrl)}
          className="object-cover group-hover:opacity-95"
          sizes="(max-width: 640px) 78vw, (max-width: 1024px) 352px, 512px"
        />

        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/50 to-transparent p-6 text-left text-white md:p-8">
          <h3 className="font-serif text-2xl font-medium md:text-3xl lg:text-4xl">
            {collection.title}
          </h3>
        </div>
      </Link>
    </article>
  );
}
