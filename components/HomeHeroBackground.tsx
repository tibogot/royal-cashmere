"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const VIDEO_DESKTOP =
  "https://dymcnsx6f7jgtkqa.public.blob.vercel-storage.com/royal-cashmere/9784260-desktop.mp4";
const VIDEO_MOBILE =
  "https://dymcnsx6f7jgtkqa.public.blob.vercel-storage.com/royal-cashmere/9784260-mobile.mp4";
const POSTER = "/images/9784260-poster.jpg";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function isMobileClient() {
  return (
    /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    window.innerWidth < 768
  );
}

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
    () =>
      !window.matchMedia(REDUCED_MOTION_QUERY).matches && !isSlowConnection(),
    () => false,
  );
}

function useIsMobile() {
  return useSyncExternalStore(
    () => () => {},
    isMobileClient,
    () => false,
  );
}

export default function HomeHeroBackground() {
  const isMobile = useIsMobile();
  const shouldLoadVideo = useShouldLoadVideo();
  const videoSrc = isMobile ? VIDEO_MOBILE : VIDEO_DESKTOP;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  // A cached video can reach `canplay` before React attaches the onCanPlay
  // listener (especially on client-side navigation, when hydration keeps the
  // main thread busy). In that case the event fires into the void and the
  // video would stay hidden. Checking `readyState` on mount closes that race —
  // `>= 3` is HAVE_FUTURE_DATA, i.e. the browser can already play it.
  useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 3) setReady(true);
  }, []);

  if (!shouldLoadVideo) {
    return (
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${POSTER})` }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div className="absolute inset-0 z-0" aria-hidden="true">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster={POSTER}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
        // Keep this: forces the video off Chrome's GPU overlay plane (which
        // desyncs from Lenis's scroll and causes jitter). The filter is
        // imperceptible but required — translateZ/clip-path don't work.
        style={{ filter: "brightness(1.0001)" }}
        onCanPlay={() => setReady(true)}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    </div>
  );
}
