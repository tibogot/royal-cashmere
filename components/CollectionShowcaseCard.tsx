import {
  isShopifyCdnUrl,
  shopifyImageUrl,
  SHOPIFY_IMAGE_WIDTH,
} from "@/lib/shopify/image";
import { routes } from "@/lib/routes";
import type { ShopifyCollection } from "@/lib/shopify/queries";
import FadeInImage from "@/components/FadeInImage";
import Link from "next/link";

type CollectionShowcaseCardProps = {
  collection: ShopifyCollection;
};

export default function CollectionShowcaseCard({
  collection,
}: CollectionShowcaseCardProps) {
  const imageUrl = collection.imageUrl ?? "";
  const resolvedSrc = shopifyImageUrl(imageUrl, SHOPIFY_IMAGE_WIDTH.card);

  return (
    <Link
      href={routes.collectionByHandle(collection.handle)}
      className="group relative block h-[60svh] w-full md:h-[80svh]"
    >
      <FadeInImage
        src={resolvedSrc}
        alt={collection.imageAlt ?? collection.title}
        fill
        unoptimized={isShopifyCdnUrl(imageUrl)}
        className="object-cover group-hover:opacity-95"
        sizes="(max-width: 768px) 100vw, 33vw"
      />

      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/50 to-transparent p-6 text-left text-white md:p-8">
        <h3 className="font-serif text-2xl font-medium md:text-3xl lg:text-4xl">
          {collection.title}
        </h3>
      </div>
    </Link>
  );
}
