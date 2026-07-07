"use client";

import CartPageView from "@/components/CartPageView";
import PanelCloseButton from "@/components/PanelCloseButton";
import type { Cart } from "@/lib/shopify/cart";
import { useOverlayScrollLock } from "@/lib/useOverlayScrollLock";
import gsap from "gsap";
import { useCallback, useEffect, useId, useRef, useState } from "react";
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
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useOverlayScrollLock(isVisible);

  const refreshCart = useCallback(async (showLoading = false) => {
    if (showLoading) {
      setIsLoading(true);
    }

    try {
      const response = await fetch("/api/cart", { cache: "no-store" });
      if (!response.ok) {
        setCart(null);
        return;
      }

      const data = (await response.json()) as { cart: Cart | null };
      setCart(data.cart);
    } catch {
      setCart(null);
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      refreshCart(true);
    }
  }, [open, refreshCart]);

  useEffect(() => {
    const handleCartUpdated = () => {
      refreshCart();
    };

    window.addEventListener("cart-updated", handleCartUpdated);
    return () => window.removeEventListener("cart-updated", handleCartUpdated);
  }, [refreshCart]);

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
        className="absolute inset-y-0 right-0 flex h-dvh max-h-dvh w-full max-w-md flex-col overflow-hidden bg-white px-4 py-4 text-black shadow-2xl"
        data-lenis-prevent
      >
        <div className="flex shrink-0 items-center justify-between gap-4">
          <h2 id={titleId} className="text-sm uppercase tracking-wide">
            Panier
            {cart && cart.totalQuantity > 0 ? (
              <span className="text-black/50"> ({cart.totalQuantity})</span>
            ) : null}
          </h2>
          <PanelCloseButton onClose={onClose} />
        </div>

        {isLoading ? (
          <p className="mt-6 text-sm text-black/50">Chargement…</p>
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
