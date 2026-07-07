"use client";

import { routes } from "@/lib/routes";
import type { ShopifyCollection } from "@/lib/shopify/queries";
import FadeInImage from "@/components/FadeInImage";
import Link from "next/link";

type BoutiqueNavMenuProps = {
  collections: ShopifyCollection[];
};

const linkClassName =
  "animated-underline w-fit text-xs uppercase tracking-wide text-black";

const cardTitleClassName =
  "animated-underline text-[10px] uppercase tracking-wide text-black md:text-xs";

const featuredCardImages = [
  {
    src: "/images/0179.1 jumper 1239 pants 1.jpg",
    alt: "Pull et pantalon en cachemire Royal Cashmere",
  },
  {
    src: "/images/1140.3 coat 1.jpg",
    alt: "Manteau en cachemire Royal Cashmere",
  },
] as const;

type FeaturedCardProps = {
  href: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
};

function FeaturedCard({ href, title, imageSrc, imageAlt }: FeaturedCardProps) {
  return (
    <Link
      href={href}
      className="group flex w-56 shrink-0 flex-col gap-3 sm:w-64 md:w-72 lg:w-80"
    >
      <div className="relative aspect-3/4 overflow-hidden bg-black/5">
        <FadeInImage
          src={imageSrc}
          alt={imageAlt}
          fill
          loading="lazy"
          fetchPriority="low"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 224px, (max-width: 1024px) 288px, 320px"
        />
      </div>
      <p className={cardTitleClassName}>
        {title}
      </p>
    </Link>
  );
}

export default function BoutiqueNavMenu({
  collections,
}: BoutiqueNavMenuProps) {
  const featuredCards = featuredCardImages.map((image, index) => {
    const collection = collections[index];

    return {
      href: collection
        ? routes.collectionByHandle(collection.handle)
        : routes.shop,
      title: collection?.title ?? "Boutique",
      imageSrc: image.src,
      imageAlt: image.alt,
    };
  });

  return (
    <div className="grid items-start gap-8 px-4 pb-10 pt-2 md:grid-cols-[minmax(0,1fr)_auto] md:px-8 lg:gap-20">
      <nav
        aria-label="Boutique"
        className="flex flex-col gap-3 py-2 md:min-w-40 lg:min-w-48"
      >
        <Link href={routes.shop} className={linkClassName}>
          Tout
        </Link>
        {collections.map((collection) => (
          <Link
            key={collection.id}
            href={routes.collectionByHandle(collection.handle)}
            className={linkClassName}
          >
            {collection.title}
          </Link>
        ))}
      </nav>

      <div className="flex gap-5 lg:gap-8">
        {featuredCards.map((card) => (
          <FeaturedCard
            key={card.imageSrc}
            href={card.href}
            title={card.title}
            imageSrc={card.imageSrc}
            imageAlt={card.imageAlt}
          />
        ))}
      </div>
    </div>
  );
}
