"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

type SplitTextRevealProps = {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  className?: string;
  // Seconds between each line starting.
  stagger?: number;
  duration?: number;
  delay?: number;
  // ScrollTrigger start position; the reveal plays once when it is reached.
  start?: string;
  // Selector of an ancestor to use as the trigger instead of this element,
  // e.g. "a" to sync with a card's image reveal (same start, offset by delay).
  triggerClosest?: string;
  // false slides the whole content up as one masked block instead of
  // splitting it — for elements like CTAs whose underline is a pseudo-element.
  splitLines?: boolean;
  // Start invisible already in the server HTML. Use it above the fold, where
  // the text would otherwise flash fully visible before hydration, vanish
  // for the split, then reveal.
  hiddenUntilReveal?: boolean;
};

/**
 * Splits its text into lines and slides each line up from behind a mask when
 * the element scrolls into view, playing once. Lines re-split on resize and
 * after web fonts load, so the breaks always match the rendered layout.
 */
export default function SplitTextReveal({
  children,
  as: Tag = "div",
  className,
  stagger = 0.12,
  duration = 1.1,
  delay = 0,
  start = "top 85%",
  triggerClosest,
  splitLines = true,
  hiddenUntilReveal = false,
}: SplitTextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const blockRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const trigger = (triggerClosest && el.closest(triggerClosest)) || el;

      const reveal = (targets: gsap.TweenTarget) => {
        // Lines are masked at yPercent 110 from here on, so it's safe to
        // lift the server-side hiding.
        if (hiddenUntilReveal) gsap.set(el, { visibility: "visible" });
        return gsap.from(targets, {
          yPercent: 110,
          duration,
          delay,
          stagger,
          ease: "power3.out",
          scrollTrigger: { trigger, start, once: true },
        });
      };

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (!splitLines) {
          reveal(blockRef.current);
          return;
        }

        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          // Returning the tween lets SplitText carry its progress over when
          // it re-splits, so a finished reveal doesn't replay on resize.
          onSplit: (self) => reveal(self.lines),
        });

        return () => split.revert();
      });

      return () => mm.revert();
    },
    {
      scope: ref,
      dependencies: [
        stagger,
        duration,
        delay,
        start,
        triggerClosest,
        splitLines,
        hiddenUntilReveal,
      ],
    },
  );

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      // motion-safe only: with reduced motion GSAP never runs, so the text
      // must not start hidden.
      className={`${className ?? ""}${
        hiddenUntilReveal ? " motion-safe:invisible" : ""
      }`}
    >
      {splitLines ? (
        children
      ) : (
        <span className="block overflow-clip">
          <span ref={blockRef} className="block">
            {children}
          </span>
        </span>
      )}
    </Tag>
  );
}
