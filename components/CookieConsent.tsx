"use client";

import { getCookieConsent, setCookieConsent } from "@/lib/cookie-consent";
import { routes } from "@/lib/routes";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (getCookieConsent()) return;

    setVisible(true);
    // Trigger the entrance transition on the next frame so the initial
    // (hidden) state is committed before animating in.
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  function handleAccept() {
    setCookieConsent();
    setEntered(false);
    // Let the exit transition play before unmounting.
    window.setTimeout(() => setVisible(false), 300);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
      aria-live="polite"
      className={`fixed inset-x-4 bottom-4 z-40 mx-auto max-w-104 border border-black/10 bg-primary p-5 text-black shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 ease-out sm:inset-x-auto sm:right-6 sm:bottom-6 sm:mx-0 md:p-6 ${
        entered
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <p
        id="cookie-consent-title"
        className="text-xs uppercase tracking-wide"
      >
        Cookies
      </p>
      <p
        id="cookie-consent-description"
        className="mt-3 font-serif text-sm leading-relaxed text-black/80"
      >
        Nous utilisons des cookies strictement nécessaires au fonctionnement du
        site (panier, compte client et sécurité). En continuant votre
        navigation, vous acceptez leur utilisation. Consultez notre{" "}
        <Link
          href={routes.cookies}
          className="underline underline-offset-2 transition-opacity hover:opacity-60"
        >
          politique relative aux cookies
        </Link>
        {" "}et notre{" "}
        <Link
          href={routes.privacy}
          className="underline underline-offset-2 transition-opacity hover:opacity-60"
        >
          politique de confidentialité
        </Link>
        .
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleAccept}
          className="inline-flex flex-1 items-center justify-center border border-black bg-black px-5 py-2.5 text-xs uppercase tracking-wide text-white transition-opacity hover:opacity-80"
        >
          Accepter
        </button>
        <Link
          href={routes.cookies}
          className="inline-flex flex-1 items-center justify-center border border-black/20 px-5 py-2.5 text-xs uppercase tracking-wide transition-opacity hover:opacity-60"
        >
          En savoir plus
        </Link>
      </div>
    </div>
  );
}
