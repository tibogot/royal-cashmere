"use client";

import CollectionCarouselCard from "@/components/CollectionCarouselCard";
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
    <div
      ref={containerRef}
      className="flex flex-col gap-10 md:flex-row md:items-start md:gap-12 lg:gap-20"
    >
      <div className="flex shrink-0 flex-col md:w-[min(100%,22rem)] lg:w-[min(100%,26rem)]">
        <h1 className="font-serif text-5xl uppercase leading-[1.12] md:text-6xl md:leading-[1.1] lg:text-7xl">
          Nos
          <br />
          collections
        </h1>

        <p className="mt-6 max-w-md font-sans text-sm font-light leading-relaxed text-neutral-800 md:mt-8 md:text-base">
          Robes, pulls, pantalons et écharpes — chaque collection révèle la
          douceur du pur cachemire mongol, pensée pour accompagner vos saisons.
        </p>

        <div className="mt-8 flex flex-col items-start gap-2 md:mt-12">
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
        className="min-w-0 flex-1 overflow-hidden md:-mr-8 md:pr-8 lg:-mr-8 lg:pr-8"
        style={{ touchAction: "pan-y" }}
      >
        <div ref={trackRef} className="flex w-max items-stretch gap-6">
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
