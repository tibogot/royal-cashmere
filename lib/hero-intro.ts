// Fired on window when the home hero image finishes its reveal, so the navbar
// can slide in right after. Lives outside the "use client" modules so the
// server page can import the plain string.
export const HERO_REVEALED_EVENT = "home-hero-revealed";
