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
  // With `reveal`: start clipped already in the server HTML. Use it above the
  // fold, where the image would otherwise flash fully visible before
  // hydration and then vanish for the reveal.
  hiddenUntilReveal?: boolean;
  // With `reveal`: window event dispatched when the reveal finishes.
  revealedEvent?: string;
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
  hiddenUntilReveal = false,
  revealedEvent,
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
              onComplete: () => {
                if (revealedEvent) {
                  window.dispatchEvent(new Event(revealedEvent));
                }
              },
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
    { scope: ref, dependencies: [from, reveal, revealedEvent] },
  );

  return (
    <div
      ref={ref}
      // motion-safe only: with reduced motion GSAP never runs, so the image
      // must not start clipped. Once GSAP runs, its inline clip-path wins.
      className={`absolute inset-0 will-change-transform ${
        reveal && hiddenUntilReveal
          ? "motion-safe:[clip-path:inset(100%_0%_0%_0%)]"
          : ""
      }`}
    >
      {children}
    </div>
  );
}
