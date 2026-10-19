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
  // Play once when the card enters the viewport instead of scrubbing, with a
  // bottom-to-top clip-path reveal alongside the shrink.
  reveal?: boolean;
};

/**
 * Wraps an image that fills a card with `overflow-hidden`: as the card scrolls
 * into view the image shrinks from `from` down to 1, scrubbed to the scroll.
 * It never goes below 1, so the image always covers the card.
 */
export default function ScrollShrinkImage({
  children,
  from = 1.12,
  reveal = false,
}: ScrollShrinkImageProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const card = el?.parentElement;
      if (!el || !card) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (reveal) {
          gsap.fromTo(
            el,
            { scale: from, clipPath: "inset(100% 0% 0% 0%)" },
            {
              scale: 1,
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.4,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                once: true,
              },
            },
          );
          return;
        }

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
    { scope: ref, dependencies: [from, reveal] },
  );

  return (
    <div ref={ref} className="absolute inset-0 will-change-transform">
      {children}
    </div>
  );
}
