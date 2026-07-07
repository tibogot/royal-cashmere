"use client";

import CollectionCarouselCard, {
  collectionCarouselCardWidthClass,
} from "@/components/CollectionCarouselCard";
import type { ShopifyCollection } from "@/lib/shopify/queries";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { useRef } from "react";

gsap.registerPlugin(Draggable, InertiaPlugin, useGSAP);

type CollectionsSectionProps = {
  collections: ShopifyCollection[];
};

export default function CollectionsSection({
  collections,
}: CollectionsSectionProps) {
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
    { scope: containerRef, dependencies: [collections.length] },
  );

  const scroll = (direction: "prev" | "next") => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;

    const firstCard = track.querySelector<HTMLElement>("article");
    const gap = 24;
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

  if (collections.length === 0) return null;

  return (
    <div ref={containerRef}>
      <div className="mb-10 flex items-start justify-end gap-6 md:mb-12">
        <div className="flex flex-col items-end gap-2">
          <button
            type="button"
            onClick={() => scroll("next")}
            aria-label="Collection suivante"
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
            aria-label="Collection précédente"
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
        <div ref={trackRef} className="flex w-max items-stretch gap-6">
          <article className="relative w-[88vw] shrink-0  sm:w-104 md:w-lg lg:w-152 xl:w-2xl">
            <div
              className={`invisible aspect-3/4 ${collectionCarouselCardWidthClass}`}
              aria-hidden="true"
            />

            <div className="absolute inset-0 flex items-center justify-center px-8 md:px-12">
              <div className="flex max-w-md flex-col items-center text-center md:max-w-lg">
                <h1 className="font-serif text-3xl uppercase leading-[1.12] sm:text-4xl md:text-5xl md:leading-[1.1] lg:text-6xl">
                  Royal Cashmere Collections
                </h1>

                <p className="mt-6 font-sans text-sm font-light leading-relaxed text-neutral-800 md:mt-8 md:text-base">
                  Robes, pulls, pantalons et écharpes — chaque collection révèle
                  la douceur du pur cachemire mongol, pensée pour accompagner
                  vos saisons.
                </p>
              </div>
            </div>
          </article>

          {collections.map((collection) => (
            <CollectionCarouselCard
              key={collection.id}
              collection={collection}
              preventClickAfterDrag
            />
          ))}
        </div>
      </div>
    </div>
  );
}
