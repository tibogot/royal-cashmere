"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";

const VIDEO_DESKTOP =
  "https://dymcnsx6f7jgtkqa.public.blob.vercel-storage.com/royal-cashmere/9784260-desktop.mp4";
const VIDEO_MOBILE =
  "https://dymcnsx6f7jgtkqa.public.blob.vercel-storage.com/royal-cashmere/9784260-mobile.mp4";
const POSTER = "/images/9784260-poster.jpg";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function isSlowConnection() {
  const connection = (
    navigator as Navigator & { connection?: { effectiveType?: string } }
  ).connection;
  return connection?.effectiveType === "2g";
}

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

// Detects, on the client only, whether the heavy hero video should load.
// `useSyncExternalStore` keeps this in sync (and reacts to reduced-motion
// changes) without a setState-in-effect and renders the poster during SSR.
function useShouldLoadVideo() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getShouldLoadVideoSnapshot,
    getServerShouldLoadVideoSnapshot,
  );
}

function getShouldLoadVideoSnapshot() {
  return (
    !window.matchMedia(REDUCED_MOTION_QUERY).matches && !isSlowConnection()
  );
}

function getServerShouldLoadVideoSnapshot() {
  return false;
}

export default function HomeHeroBackground() {
  const shouldLoadVideo = useShouldLoadVideo();

  // The poster is a real <Image>, not a CSS background: it gets resized and
  // preloaded by Next, so it is what the visitor sees while the video loads.
  // Plain Image (no fade) so it never delays first paint. The video has no
  // `poster` attribute of its own; until it has a frame it is transparent and
  // this image shows through underneath.
  return (
    <div className="absolute inset-0 z-0" aria-hidden="true">
      <Image
        src={POSTER}
        alt=""
        fill
        preload
        className="object-cover"
        sizes="100vw"
        quality={75}
      />
      {shouldLoadVideo ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
          // Keep this: forces the video off Chrome's GPU overlay plane (which
          // desyncs from Lenis's scroll and causes jitter). The filter is
          // imperceptible but required — translateZ/clip-path don't work.
          style={{ filter: "brightness(1.0001)" }}
        >
          <source
            src={VIDEO_MOBILE}
            type="video/mp4"
            media="(max-width: 767px)"
          />
          <source
            src={VIDEO_DESKTOP}
            type="video/mp4"
            media="(min-width: 768px)"
          />
        </video>
      ) : null}
    </div>
  );
}
