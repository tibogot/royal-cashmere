"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

/**
 * next/image with a soft fade-in — but only when the image actually has to
 * load over the network. Cached / already-seen images appear instantly, with
 * no transition at all, so revisiting a page never re-plays the effect.
 *
 * How it works: the ref callback runs during commit (before the browser
 * paints). A cached image already reports `complete === true` at that point,
 * so we mark it "instant" and render it at full opacity with no transition —
 * the user never sees the opacity-0 frame. Only images that are still loading
 * fall through to the `onLoad` fade.
 *
 * Opacity is toggled with utility classes (not inline styles) so callers can
 * still layer hover states like `group-hover:opacity-95` on top.
 */
export default function FadeInImage({
  className = "",
  onLoad,
  ...props
}: ImageProps) {
  // "pending" = hidden, not yet known · "instant" = was cached, show now, no
  // fade · "fading" = had to load, animate in.
  const [state, setState] = useState<"pending" | "instant" | "fading">(
    "pending",
  );

  const handleRef = (node: HTMLImageElement | null) => {
    // Fires during commit, before paint. A cached image is already `complete`
    // here, so we can skip the animation without ever flashing opacity-0.
    if (node?.complete) setState("instant");
  };

  const isVisible = state !== "pending";
  const shouldAnimate = state === "fading";

  return (
    <Image
      ref={handleRef}
      {...props}
      onLoad={(event) => {
        // Only start a fade if the image wasn't already resolved as cached.
        setState((prev) => (prev === "instant" ? prev : "fading"));
        onLoad?.(event);
      }}
      className={`${shouldAnimate ? "transition-opacity duration-700 ease-out" : ""} ${
        isVisible ? "opacity-100" : "opacity-0"
      } ${className}`}
    />
  );
}
