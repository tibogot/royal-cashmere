// Fired on window when the home hero image finishes its reveal, so the navbar
// can slide in right after. Lives outside the "use client" modules so the
// server page can import the plain string.
export const HERO_REVEALED_EVENT = "home-hero-revealed";

// Set on window alongside the event, for listeners that mount after it fired:
// the reveal can finish before React has hydrated the navbar.
export const HERO_REVEALED_FLAG = "__homeHeroRevealed";

// Starts the CSS hero reveal (globals.css, `.hero-reveal`) once the photo is
// downloaded and decoded. The hero photo is the page's LCP element, so this
// runs as an inline script in the server HTML instead of waiting for the JS
// bundle; HomeHeroReveal calls it again on client navigations, where React
// doesn't run inline scripts. It is serialized with toString(), so it must
// stay self-contained: no imports, no outside variables.
export function startHeroReveal(eventName: string, flagName: string) {
  const el = document.querySelector<HTMLElement>("[data-hero-reveal]");
  if (!el || el.hasAttribute("data-revealed")) return;

  const finish = () => {
    (window as unknown as Record<string, boolean>)[flagName] = true;
    window.dispatchEvent(new Event(eventName));
  };

  let started = false;
  const play = () => {
    if (started) return;
    started = true;
    el.addEventListener("animationend", (event) => {
      if (event.target === el) finish();
    });
    el.setAttribute("data-revealed", "");
    // No animation runs with reduced motion, so no animationend either.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) finish();
  };

  const img = el.querySelector("img");
  if (!img) {
    play();
    return;
  }

  // Decoding first keeps the slide smooth on phones.
  const ready = () => {
    img.decode().catch(() => {}).then(play);
  };
  if (img.complete) ready();
  else {
    img.addEventListener("load", ready, { once: true });
    img.addEventListener("error", play, { once: true });
  }
  // Never leave the hero hidden on a slow or failed image.
  window.setTimeout(play, 2500);
}
