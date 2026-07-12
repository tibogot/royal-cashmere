"use client";

import PanelCloseButton from "@/components/PanelCloseButton";
import ShopifyProductImage from "@/components/ShopifyProductImage";
import { popularSearches } from "@/lib/categories";
import { routes } from "@/lib/routes";
import { SHOPIFY_IMAGE_WIDTH } from "@/lib/shopify/image";
import type { ShopifyProduct } from "@/lib/shopify/queries";
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
const SEARCH_DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 2;

type SearchResponse = {
  products: ShopifyProduct[];
  total: number;
};

export default function SearchPanel({ open, onClose }: SearchPanelProps) {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const tweenRef = useRef<gsap.core.Timeline | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ShopifyProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const mounted = useMounted();

  const trimmedQuery = query.trim();
  const showLiveSearch = trimmedQuery.length >= MIN_QUERY_LENGTH;

  // Keep the panel mounted while open (and during the close animation, which
  // resets isVisible on completion). Adjusting state during render is preferred
  // over a sync effect.
  if (open && !isVisible) {
    setIsVisible(true);
  }

  useOverlayScrollLock(isVisible);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      setTotal(0);
      setIsSearching(false);
    }
  }, [open]);

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

  useEffect(() => {
    if (!showLiveSearch) {
      setResults([]);
      setTotal(0);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(trimmedQuery)}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Search request failed");
        }

        const data = (await response.json()) as SearchResponse;
        setResults(data.products);
        setTotal(data.total);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setResults([]);
        setTotal(0);
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [showLiveSearch, trimmedQuery]);

  const navigateToAllResults = () => {
    onClose();

    if (!trimmedQuery) {
      router.push(routes.shop);
      return;
    }

    router.push(`${routes.shop}?q=${encodeURIComponent(trimmedQuery)}`);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigateToAllResults();
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
            type="text"
            inputMode="search"
            enterKeyHint="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full cursor-text border-b border-black/20 bg-transparent py-3 text-sm text-black outline-none placeholder:text-black/40 md:text-base"
            autoComplete="off"
            role="combobox"
            aria-expanded={showLiveSearch && (results.length > 0 || isSearching)}
            aria-controls="search-results"
            aria-autocomplete="list"
          />

          {showLiveSearch ? (
            <div
              id="search-results"
              role="listbox"
              aria-label="Résultats de recherche"
              aria-live="polite"
              className="mt-8"
            >
              {isSearching ? (
                <p className="text-sm text-black/50">Recherche en cours…</p>
              ) : results.length > 0 ? (
                <>
                  <ul className="flex flex-col gap-4">
                    {results.map((product) => (
                      <li key={product.id} role="option">
                        <Link
                          href={routes.product(product.handle)}
                          onClick={onClose}
                          className="group flex items-center gap-4 transition-opacity hover:opacity-70"
                        >
                          <div className="h-20 w-16 shrink-0">
                            <ShopifyProductImage
                              src={product.imageUrl}
                              alt={product.imageAlt}
                              sizes="64px"
                              className="aspect-4/5"
                              padding="sm"
                              width={SHOPIFY_IMAGE_WIDTH.thumb}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-sans text-sm font-medium uppercase text-black">
                              {product.title}
                            </p>
                            <p className="mt-1 text-sm text-black/60">
                              {product.price}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="submit"
                    className={`${ctaLinkClassName} mt-8 font-sans transition-opacity hover:opacity-60`}
                  >
                    Voir tous les résultats ({total})
                  </button>
                </>
              ) : (
                <p className="text-sm text-black/60">
                  Aucun produit trouvé pour &ldquo;{trimmedQuery}&rdquo;.
                </p>
              )}
            </div>
          ) : null}
        </form>

        {!showLiveSearch ? (
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
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
