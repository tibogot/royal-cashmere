"use client";

import {
  HERO_REVEALED_EVENT,
  HERO_REVEALED_FLAG,
  startHeroReveal,
} from "@/lib/hero-intro";
import { useEffect, type ReactNode } from "react";

// The home hero's slide-up reveal, in CSS (globals.css) rather than GSAP so it
// can start before the JS bundle loads. On a full page load the inline script
// in the page starts it; this effect covers client navigations to the home
// page, and is a no-op once the reveal has started.
export default function HomeHeroReveal({ children }: { children: ReactNode }) {
  useEffect(() => {
    startHeroReveal(HERO_REVEALED_EVENT, HERO_REVEALED_FLAG);
  }, []);

  return (
    <div
      data-hero-reveal
      // The inline script adds data-revealed before hydration.
      suppressHydrationWarning
      className="hero-reveal absolute inset-0 overflow-hidden"
    >
      <div className="hero-reveal-image absolute inset-0 will-change-transform">
        {children}
      </div>
    </div>
  );
}
