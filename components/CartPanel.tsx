"use client";

import CartPageView from "@/components/CartPageView";
import PanelCloseButton from "@/components/PanelCloseButton";
import {
  getCart,
  getCartHasFetched,
  getServerCart,
  getServerCartHasFetched,
  refreshCart,
  subscribeCart,
} from "@/lib/cart-store";
import { useMounted } from "@/lib/useMounted";
import { useOverlayScrollLock } from "@/lib/useOverlayScrollLock";
import gsap from "gsap";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

type CartPanelProps = {
  open: boolean;
  onClose: () => void;
};

const PANEL_ANIM_DURATION = 0.5;

export default function CartPanel({ open, onClose }: CartPanelProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLButtonElement>(null);
  const tweenRef = useRef<gsap.core.Timeline | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const mounted = useMounted();

  const cart = useSyncExternalStore(subscribeCart, getCart, getServerCart);
  const hasFetched = useSyncExternalStore(
    subscribeCart,
    getCartHasFetched,
    getServerCartHasFetched,
  );

  // Keep the panel mounted while it's open (and during the close animation,
  // which flips isVisible back to false on completion). Adjusting state during
  // render is preferred over a sync effect.
  if (open && !isVisible) {
    setIsVisible(true);
  }

  useOverlayScrollLock(isVisible);

  useEffect(() => {
    if (!open) return;
    void refreshCart();
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

      return () => {
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

  if (!mounted || !isVisible) return null;

  const showLoading = !hasFetched;

  return createPortal(
    <div className="fixed inset-0 z-60">
      <button
        type="button"
        ref={overlayRef}
        aria-label="Fermer le panier"
        className="absolute inset-0 bg-black/40 opacity-0"
        onClick={onClose}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute inset-y-0 right-0 flex h-dvh max-h-dvh w-full max-w-md flex-col overflow-hidden bg-white text-black shadow-2xl"
        data-lenis-prevent
      >
        <div className="flex shrink-0 items-center justify-between gap-4 px-4 py-4 md:px-8">
          <h2 id={titleId} className="text-sm uppercase tracking-wide">
            Panier
            {cart && cart.totalQuantity > 0 ? (
              <span className="text-black/50"> ({cart.totalQuantity})</span>
            ) : null}
          </h2>
          <PanelCloseButton onClose={onClose} />
        </div>

        {showLoading ? (
          <p className="mt-6 px-4 text-sm text-black/50 md:px-8">Chargement…</p>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <CartPageView cart={cart} variant="panel" onClose={onClose} />
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
