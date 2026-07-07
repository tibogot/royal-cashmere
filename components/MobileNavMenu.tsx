"use client";

import CartNavLink from "@/components/CartNavLink";
import WishlistNavLink from "@/components/WishlistNavLink";
import { routes } from "@/lib/routes";
import type { ShopifyCollection } from "@/lib/shopify/queries";
import { useOverlayScrollLock } from "@/lib/useOverlayScrollLock";
import gsap from "gsap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

type MobileNavMenuProps = {
  open: boolean;
  onClose: () => void;
  onCartOpen: () => void;
  collections?: ShopifyCollection[];
};

const MENU_ANIM_DURATION = 0.45;

const otherLinks = [
  { label: "Collection", href: routes.collection },
  { label: "Journal", href: routes.journal },
  { label: "À propos", href: routes.about },
  { label: "Contact", href: routes.contact },
  { label: "Mon compte", href: routes.account },
] as const;

const linkClassName =
  "text-xs uppercase tracking-wide transition-opacity hover:opacity-60";

const subLinkClassName =
  "text-[11px] uppercase tracking-wide transition-opacity hover:opacity-60";

function subscribeNoop() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export default function MobileNavMenu({
  open,
  onClose,
  onCartOpen,
  collections = [],
}: MobileNavMenuProps) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const previousPathnameRef = useRef(pathname);
  const tweenRef = useRef<gsap.core.Timeline | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [boutiqueOpen, setBoutiqueOpen] = useState(false);
  const mounted = useSyncExternalStore(
    subscribeNoop,
    getClientSnapshot,
    getServerSnapshot,
  );

  const shouldRender = open || isClosing;

  // Lock background scroll (body/html overflow + Lenis) while the menu is open,
  // matching the cart and search overlays via the shared hook.
  useOverlayScrollLock(open);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setBoutiqueOpen(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (previousPathnameRef.current === pathname) return;

    previousPathnameRef.current = pathname;
    tweenRef.current?.kill();
    setIsClosing(false);
    setBoutiqueOpen(false);
    onClose();
  }, [pathname, onClose]);

  useEffect(() => {
    if (!shouldRender) return;

    const panel = panelRef.current;
    if (!panel) return;

    tweenRef.current?.kill();

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const duration = reduceMotion ? 0 : MENU_ANIM_DURATION;

    if (open) {
      gsap.set(panel, { xPercent: -100 });

      tweenRef.current = gsap.timeline().to(panel, {
        xPercent: 0,
        duration,
        ease: "power3.out",
      });

      return () => {
        tweenRef.current?.kill();
      };
    }

    tweenRef.current = gsap.timeline({
      onComplete: () => setIsClosing(false),
    }).to(panel, {
      xPercent: -100,
      duration,
      ease: "power3.inOut",
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, [open, shouldRender]);

  if (!mounted || !shouldRender) return null;

  return createPortal(
    <div className={`fixed inset-0 z-60 md:hidden ${open ? "" : "pointer-events-none"}`}>
      <div
        ref={panelRef}
        className="absolute inset-0 flex flex-col bg-white px-4 pb-6 pt-4 text-black"
        data-lenis-prevent
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Fermer le menu"
          className={`flex h-8 w-fit items-center ${linkClassName}`}
        >
          Fermer
        </button>

        <nav className="mt-8 flex flex-1 flex-col">
          <ul className="flex flex-col gap-6">
            {/* Boutique with expandable sub-links */}
            <li>
              <div className="flex items-center justify-between">
                <Link href={routes.shop} onClick={handleClose} className={linkClassName}>
                  Boutique
                </Link>
                <button
                  type="button"
                  onClick={() => setBoutiqueOpen((v) => !v)}
                  aria-label={boutiqueOpen ? "Masquer les catégories" : "Afficher les catégories"}
                  className="flex h-6 w-6 items-center justify-center text-sm leading-none transition-opacity hover:opacity-60"
                >
                  {boutiqueOpen ? "−" : "+"}
                </button>
              </div>
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: boutiqueOpen ? "20rem" : "0" }}
              >
                <ul className="mt-3 flex flex-col gap-3 border-l border-black/15 pl-3">
                  <li>
                    <Link href={routes.shop} onClick={handleClose} className={subLinkClassName}>
                      Tout
                    </Link>
                  </li>
                  {collections.map((collection) => (
                    <li key={collection.id}>
                      <Link
                        href={routes.collectionByHandle(collection.handle)}
                        onClick={handleClose}
                        className={subLinkClassName}
                      >
                        {collection.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            {otherLinks.map(({ label, href }) => (
              <li key={href}>
                <Link href={href} onClick={handleClose} className={linkClassName}>
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <WishlistNavLink
                className={linkClassName}
                onClick={handleClose}
              />
            </li>
            <li>
              <CartNavLink
                className={linkClassName}
                onClick={() => {
                  handleClose();
                  onCartOpen();
                }}
              />
            </li>
          </ul>
        </nav>
      </div>
    </div>,
    document.body,
  );
}
