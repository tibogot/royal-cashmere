"use client";

import CartQuickAddCard from "@/components/CartQuickAddCard";
import ProductCard from "@/components/ProductCard";
import { routes } from "@/lib/routes";
import { ctaLinkClassName } from "@/lib/ui";
import type { CartCarouselProduct } from "@/lib/shopify/products";
import type { ShopifyProduct } from "@/lib/shopify/queries";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import Link from "next/link";
import { useRef } from "react";

gsap.registerPlugin(Draggable, InertiaPlugin, useGSAP);

type FeaturedProductsCarouselProps = {
  products: ShopifyProduct[] | CartCarouselProduct[];
  showViewAll?: boolean;
  compact?: boolean;
  quickAdd?: boolean;
};

function isQuickAddProduct(
  product: ShopifyProduct | CartCarouselProduct,
): product is CartCarouselProduct {
  return "defaultVariantId" in product;
}

export default function FeaturedProductsCarousel({
  products,
  showViewAll = true,
  compact = false,
  quickAdd = false,
}: FeaturedProductsCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      const viewport = viewportRef.current;
      if (!track || !viewport) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const getBounds = () => {
        const overflow = track.scrollWidth - viewport.clientWidth;
        return { minX: overflow > 0 ? -overflow : 0, maxX: 0 };
      };

      gsap.set(track, { x: 0 });

      const draggable = Draggable.create(track, {
        type: "x",
        inertia: !reduceMotion,
        dragClickables: true,
        allowNativeTouchScrolling: true,
        edgeResistance: 0.85,
        cursor: "grab",
        activeCursor: "grabbing",
        bounds: getBounds(),
      })[0];

      const syncBounds = () => {
        const bounds = getBounds();
        draggable.applyBounds(bounds);
        const currentX = Number(gsap.getProperty(track, "x") ?? 0);
        gsap.set(track, {
          x: gsap.utils.clamp(bounds.minX, bounds.maxX, currentX),
        });
      };

      const onResize = () => {
        syncBounds();
      };

      window.addEventListener("resize", onResize);
      const resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(track);
      resizeObserver.observe(viewport);
      requestAnimationFrame(syncBounds);

      return () => {
        window.removeEventListener("resize", onResize);
        resizeObserver.disconnect();
        draggable.kill();
        gsap.set(track, { clearProps: "transform" });
      };
    },
    { scope: containerRef, dependencies: [products.length] },
  );

  const scroll = (direction: "prev" | "next") => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;

    const firstCard = track.querySelector<HTMLElement>("article");
    const gap = compact ? 16 : 24;
    const distance = (firstCard?.offsetWidth ?? viewport.clientWidth) + gap;
    const overflow = track.scrollWidth - viewport.clientWidth;
    const minX = overflow > 0 ? -overflow : 0;
    const currentX = Number(gsap.getProperty(track, "x") ?? 0);
    const target = gsap.utils.clamp(
      minX,
      0,
      currentX + (direction === "next" ? -distance : distance),
    );

    gsap.to(track, {
      x: target,
      duration: 0.6,
      ease: "power2.out",
    });
  };

  return (
    <div ref={containerRef}>
      <div
        className={`flex items-start justify-between gap-6 ${
          compact ? "mb-4" : showViewAll ? "mb-10 md:mb-12" : "mb-0"
        }`}
      >
        {showViewAll ? (
          <Link
            href={routes.collectionsAll}
            className={`${ctaLinkClassName} inline-block`}
          >
            Tout voir
          </Link>
        ) : (
          <div aria-hidden="true" />
        )}

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
        ref={viewportRef}
        className="overflow-hidden"
        style={{ touchAction: "pan-y" }}
      >
        <div
          ref={trackRef}
          className={`flex w-max items-stretch ${compact ? "gap-4" : "gap-6"}`}
        >
          {products.map((product) =>
            quickAdd && isQuickAddProduct(product) ? (
              <CartQuickAddCard
                key={product.id}
                product={product}
                layout={compact ? "compact" : "carousel"}
                preventClickAfterDrag
              />
            ) : (
              <ProductCard
                key={product.id}
                product={product}
                layout={compact ? "compact" : "carousel"}
                preventClickAfterDrag
              />
            ),
          )}
        </div>
      </div>
    </div>
  );
}
