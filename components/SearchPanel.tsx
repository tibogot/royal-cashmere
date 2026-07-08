"use client";

import PanelCloseButton from "@/components/PanelCloseButton";
import { popularSearches } from "@/lib/categories";
import { routes } from "@/lib/routes";
import { ctaLinkClassName } from "@/lib/ui";
import { useMounted } from "@/lib/useMounted";
import { useOverlayScrollLock } from "@/lib/useOverlayScrollLock";
import gsap from "gsap";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type SearchPanelProps = {
  open: boolean;
  onClose: () => void;
};

const PANEL_ANIM_DURATION = 0.5;

export default function SearchPanel({ open, onClose }: SearchPanelProps) {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const tweenRef = useRef<gsap.core.Timeline | null>(null);
  const [query, setQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const mounted = useMounted();

  // Keep the panel mounted while open (and during the close animation, which
  // resets isVisible on completion). Adjusting state during render is preferred
  // over a sync effect.
  if (open && !isVisible) {
    setIsVisible(true);
  }

  useOverlayScrollLock(isVisible);

  useEffect(() => {
    if (!isVisible) return;

    const panel = panelRef.current;
    const overlay = overlayRef.current;
    if (!panel || !overlay) return;

    tweenRef.current?.kill();

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const duration = reduceMotion ? 0 : PANEL_ANIM_DURATION;

    if (open) {
      gsap.set(panel, { xPercent: 100 });
      gsap.set(overlay, { opacity: 0 });

      tweenRef.current = gsap
        .timeline()
        .to(overlay, {
          opacity: 1,
          duration: duration * 0.85,
          ease: "power2.out",
        })
        .to(
          panel,
          {
            xPercent: 0,
            duration,
            ease: "power3.out",
          },
          0,
        );

      const frame = window.requestAnimationFrame(() => {
        inputRef.current?.focus();
      });

      return () => {
        window.cancelAnimationFrame(frame);
        tweenRef.current?.kill();
      };
    }

    tweenRef.current = gsap
      .timeline({
        onComplete: () => setIsVisible(false),
      })
      .to(panel, {
        xPercent: 100,
        duration,
        ease: "power3.inOut",
      })
      .to(
        overlay,
        {
          opacity: 0,
          duration: duration * 0.85,
          ease: "power2.inOut",
        },
        0,
      );

    return () => {
      tweenRef.current?.kill();
    };
  }, [open, isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, onClose]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = query.trim();
    onClose();

    if (!trimmed) {
      router.push(routes.shop);
      return;
    }

    router.push(`${routes.shop}?q=${encodeURIComponent(trimmed)}`);
  };

  if (!mounted || !isVisible) return null;

  return createPortal(
    <div className="fixed inset-0 z-60">
      <button
        type="button"
        ref={overlayRef}
        aria-label="Fermer la recherche"
        className="absolute inset-0 bg-black/40 opacity-0"
        onClick={onClose}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Rechercher"
        className="absolute inset-y-0 right-0 flex h-dvh max-h-dvh w-full max-w-md flex-col overflow-y-auto bg-white text-black shadow-2xl"
        data-lenis-prevent
      >
        <div className="flex shrink-0 items-center justify-end gap-4 px-4 py-4 md:px-8">
          <PanelCloseButton onClose={onClose} />
        </div>

        <form onSubmit={handleSubmit} className="px-4 md:px-8">
          <label htmlFor="search-query" className="sr-only">
            Rechercher un produit
          </label>
          <input
            ref={inputRef}
            id="search-query"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full border-b border-black/20 bg-transparent py-3 text-sm outline-none placeholder:text-black/40 md:text-base"
            autoComplete="off"
          />
          <button
            type="submit"
            className={`${ctaLinkClassName} mt-8 font-sans transition-opacity hover:opacity-60`}
          >
            Rechercher
          </button>
        </form>

        <div className="mt-12 border-t border-black/10 px-4 pt-10 md:px-8">
          <p className="text-xs uppercase tracking-wide text-black">
            Recherches populaires
          </p>
          <ul className="mt-4 flex flex-col gap-2">
            {popularSearches.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onClose}
                  className="text-xs uppercase tracking-wide transition-opacity hover:opacity-60"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>,
    document.body,
  );
}
