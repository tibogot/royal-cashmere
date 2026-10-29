"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Longest we hold the reveal waiting for the image, so a slow or failed
// download never leaves the card blank.
const IMAGE_READY_TIMEOUT_MS = 2500;

type ScrollShrinkImageProps = {
  children: React.ReactNode;
  // Scale the image starts at while the card is still entering the viewport.
  from?: number;
  // Play once when the card enters the viewport instead of scrubbing, with a
  // bottom-to-top reveal alongside the shrink.
  reveal?: boolean;
  // With `reveal`: start hidden already in the server HTML. Use it above the
  // fold, where the image would otherwise flash fully visible before
  // hydration and then vanish for the reveal.
  hiddenUntilReveal?: boolean;
  // With `reveal`: window event dispatched when the reveal finishes.
  revealedEvent?: string;
};

// Resolves once the image is downloaded and decoded, so the reveal never
// runs while the browser is still busy decoding (janky on phones).
function whenImageReady(container: HTMLElement): Promise<void> {
  const img = container.querySelector("img");
  if (!img) return Promise.resolve();

  const loaded = img.complete
    ? Promise.resolve()
    : new Promise<void>((resolve) => {
        img.addEventListener("load", () => resolve(), { once: true });
        img.addEventListener("error", () => resolve(), { once: true });
      });

  return Promise.race([
    loaded.then(() => img.decode().catch(() => {})),
    new Promise<void>((resolve) =>
      window.setTimeout(resolve, IMAGE_READY_TIMEOUT_MS),
    ),
  ]);
}

/**
 * Wraps an image that fills a card with `overflow-hidden`: as the card scrolls
 * into view the image shrinks from `from` down to 1, scrubbed to the scroll.
 * It never goes below 1, so the image always covers the card.
 *
 * The reveal slides a window up from the bottom (outer layer) while the image
 * counter-slides (inner layer) so it stays put. Same look as a clip-path
 * wipe, but transform-only: it runs on the GPU instead of repainting the
 * whole image every frame, which is what made it stutter on phones.
 */
export default function ScrollShrinkImage({
  children,
  from = 1.12,
  reveal = false,
  hiddenUntilReveal = false,
  revealedEvent,
}: ScrollShrinkImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const inner = innerRef.current;
      const card = el?.parentElement;
      if (!el || !inner || !card) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", (context) => {
        if (reveal) {
          // Hold the starting frame now (hidden, zoomed) and only start once
          // the image is ready. `y: 0` keeps GSAP from also counting the
          // server-side hiding class as a pixel offset.
          gsap.set(el, { y: 0, yPercent: 100 });
          gsap.set(inner, { y: 0, yPercent: -100, scale: from });

          // Named add() returns a context-bound function, so tweens created
          // later (after the await) are still reverted on unmount.
          const play = context.add("reveal", () => {
            const tl = gsap.timeline({
              defaults: { duration: 1.4, ease: "power3.out" },
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
            });
            tl.to(el, { yPercent: 0 }, 0);
            tl.to(inner, { yPercent: 0, scale: 1 }, 0);
          }) as () => void;

          let cancelled = false;
          void whenImageReady(inner).then(() => {
            if (!cancelled) play();
          });
          return () => {
            cancelled = true;
          };
        }

        gsap.fromTo(
          inner,
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

  // motion-safe only: with reduced motion GSAP never runs, so the image must
  // not start hidden. Once GSAP runs, its inline transforms win.
  const startHidden = reveal && hiddenUntilReveal;

  return (
    <div
      ref={ref}
      className={`absolute inset-0 overflow-hidden ${
        startHidden ? "motion-safe:transform-[translateY(100%)]" : ""
      }`}
    >
      <div
        ref={innerRef}
        className={`absolute inset-0 will-change-transform ${
          startHidden ? "motion-safe:transform-[translateY(-100%)]" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}
