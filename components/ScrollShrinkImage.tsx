"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type ScrollShrinkImageProps = {
  children: React.ReactNode;
  // Scale the image starts at while the card is still entering the viewport.
  from?: number;
};

/**
 * Wraps an image that fills a card with `overflow-hidden`: as the card scrolls
 * into view the image shrinks from `from` down to 1, scrubbed to the scroll.
 * It never goes below 1, so the image always covers the card.
 */
export default function ScrollShrinkImage({
  children,
  from = 1.12,
}: ScrollShrinkImageProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const card = el?.parentElement;
      if (!el || !card) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          el,
          { scale: from },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "center center",
              scrub: true,
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [from] },
  );

  return (
    <div ref={ref} className="absolute inset-0 will-change-transform">
      {children}
    </div>
  );
}
