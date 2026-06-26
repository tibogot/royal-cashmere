"use client";

import { routes } from "@/lib/routes";
import ProductCard from "@/components/ProductCard";
import type { ShopifyProduct } from "@/lib/shopify/queries";
import Link from "next/link";
import { useRef } from "react";

type FeaturedProductsCarouselProps = {
  products: ShopifyProduct[];
};

export default function FeaturedProductsCarousel({
  products,
}: FeaturedProductsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "prev" | "next") => {
    const track = trackRef.current;
    if (!track) return;

    const firstCard = track.querySelector<HTMLElement>("article");
    const gap = 24;
    const distance = (firstCard?.offsetWidth ?? track.clientWidth) + gap;

    track.scrollBy({
      left: direction === "next" ? distance : -distance,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="mb-10 flex items-start justify-between gap-6 md:mb-12">
        <Link
          href={routes.collectionsAll}
          className="inline-block select-none text-sm uppercase tracking-wide underline underline-offset-4 transition-opacity hover:opacity-60"
        >
          Tout voir
        </Link>

        <div className="flex flex-col items-end gap-2">
          <button
            type="button"
            onClick={() => scroll("next")}
            aria-label="Produits suivants"
            className="flex size-8 select-none items-center justify-center transition-opacity hover:opacity-60"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 8H13M13 8L9 4M13 8L9 12"
                stroke="currentColor"
                strokeWidth="1.25"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => scroll("prev")}
            aria-label="Produits précédents"
            className="flex size-8 select-none items-center justify-center bg-black text-white transition-opacity hover:opacity-80"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M13 8H3M3 8L7 4M3 8L7 12"
                stroke="currentColor"
                strokeWidth="1.25"
              />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
