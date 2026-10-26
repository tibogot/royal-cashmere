"use client";

import type { CatalogNavSection } from "@/lib/catalog";
import { NEW_IN_COLLECTION_HANDLE } from "@/lib/collection-handles";
import { routes } from "@/lib/routes";
import FadeInImage from "@/components/FadeInImage";
import Link from "next/link";

type BoutiqueNavMenuProps = {
  sections: CatalogNavSection[];
};

const linkClassName =
  "animated-underline w-fit text-xs uppercase tracking-wide text-black";

const subLinkClassName =
  "animated-underline w-fit text-xs uppercase tracking-wide text-black/55 transition-colors hover:text-black";

const cardTitleClassName =
  "animated-underline text-[10px] uppercase tracking-wide text-black md:text-xs";

const newInCard = {
  href: routes.collectionByHandle(NEW_IN_COLLECTION_HANDLE),
  title: "Nouveautés",
  imageSrc: "/images/shared/manteau.jpg",
  imageAlt: "Manteau en cachemire Royal Cashmere",
};

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

export default function BoutiqueNavMenu({ sections }: BoutiqueNavMenuProps) {
  const firstSection = sections[0];
  const featuredCards = [
    {
      href: firstSection
        ? routes.collectionByHandle(firstSection.handle)
        : routes.shop,
      title: firstSection?.label ?? "Boutique",
      imageSrc: "/images/shared/pull-et-pantalon.jpg",
      imageAlt: "Pull et pantalon en cachemire Royal Cashmere",
    },
    newInCard,
  ];

  return (
    <div className="grid items-start gap-8 px-4 pb-10 pt-2 md:grid-cols-[minmax(0,1fr)_auto] md:px-8 lg:gap-20">
      <nav
        aria-label="Boutique"
        className="flex flex-wrap gap-x-12 gap-y-8 py-2 lg:gap-x-16"
      >
        {sections.map((section) => (
          <div key={section.handle} className="flex flex-col gap-3">
            <Link
              href={routes.collectionByHandle(section.handle)}
              className={linkClassName}
            >
              {section.label}
            </Link>
            {section.children.map((child) => (
              <Link
                key={child.handle}
                href={routes.collectionByHandle(child.handle)}
                className={subLinkClassName}
              >
                {child.label}
              </Link>
            ))}
          </div>
        ))}

        <div className="flex flex-col gap-3">
          <Link href={routes.shop} className={linkClassName}>
            Tout voir
          </Link>
        </div>
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
