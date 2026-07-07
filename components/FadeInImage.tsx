"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * next/image with a soft fade-in on load instead of a hard pop-in / flash.
 *
 * Works for local, Shopify, and Sanity images alike — the effect is driven by
 * the browser's `load` event, so it's independent of the image source or
 * whether the image is optimized. The ref check covers images that are already
 * cached (and therefore `complete`) before React attaches the `onLoad` handler.
 *
 * Opacity is toggled with utility classes (not inline styles) so callers can
 * still layer hover states like `group-hover:opacity-95` on top.
 */
export default function FadeInImage({
  className = "",
  onLoad,
  ...props
}: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (ref.current?.complete) setLoaded(true);
  }, []);

  return (
    <Image
      ref={ref}
      {...props}
      onLoad={(event) => {
        setLoaded(true);
        onLoad?.(event);
      }}
      className={`transition-opacity duration-700 ease-out ${
        loaded ? "opacity-100" : "opacity-0"
      } ${className}`}
    />
  );
}
