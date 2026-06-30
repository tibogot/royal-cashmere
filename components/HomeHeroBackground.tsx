"use client";

import { useEffect, useRef, useState } from "react";

const VIDEO_DESKTOP =
  "https://dymcnsx6f7jgtkqa.public.blob.vercel-storage.com/royal-cashmere/hero-desktop.mp4";
const VIDEO_MOBILE =
  "https://dymcnsx6f7jgtkqa.public.blob.vercel-storage.com/royal-cashmere/hero-mobile.mp4";

function useHeroVideoState() {
  const [state, setState] = useState({
    isMobile: false,
    shouldLoadVideo: false,
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (
      navigator as Navigator & { connection?: { effectiveType?: string } }
    ).connection;
    const isSlowConnection = connection?.effectiveType === "2g";

    setState({
      isMobile:
        /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
        window.innerWidth < 768,
      shouldLoadVideo: !mediaQuery.matches && !isSlowConnection,
    });

    const handleChange = (event: MediaQueryListEvent) => {
      const conn = (
        navigator as Navigator & { connection?: { effectiveType?: string } }
      ).connection;
      setState((prev) => ({
        ...prev,
        shouldLoadVideo: !event.matches && !(conn?.effectiveType === "2g"),
      }));
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return state;
}

export default function HomeHeroBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isMobile, shouldLoadVideo } = useHeroVideoState();
  const videoSrc = isMobile ? VIDEO_MOBILE : VIDEO_DESKTOP;

  useEffect(() => {
    if (!shouldLoadVideo || !videoRef.current) return;

    const video = videoRef.current;
    video.loop = true;

    const handleEnded = () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    };

    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, [shouldLoadVideo, videoSrc]);

  if (!shouldLoadVideo) {
    return (
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/hero-poster.jpg)" }}
        aria-hidden="true"
      />
    );
  }

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      poster="/images/hero-poster.jpg"
      className="absolute inset-0 z-0 h-full w-full object-cover"
      aria-hidden="true"
    >
      <source src={videoSrc} type="video/mp4" />
    </video>
  );
}
