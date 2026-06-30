"use client";

import CartNavLink from "@/components/CartNavLink";
import { routes } from "@/lib/routes";
import gsap from "gsap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

type MobileNavMenuProps = {
  open: boolean;
  onClose: () => void;
  onCartOpen: () => void;
};

const MENU_ANIM_DURATION = 0.45;

const menuLinks = [
  { label: "Boutique", href: routes.shop },
  { label: "Collection", href: routes.collection },
  { label: "À propos", href: routes.about },
  { label: "Contact", href: routes.contact },
  { label: "Mon compte", href: routes.account },
] as const;

const linkClassName =
  "text-xs uppercase tracking-wide transition-opacity hover:opacity-60";

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
}: MobileNavMenuProps) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const previousPathnameRef = useRef(pathname);
  const tweenRef = useRef<gsap.core.Timeline | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const mounted = useSyncExternalStore(
    subscribeNoop,
    getClientSnapshot,
    getServerSnapshot,
  );

  const shouldRender = open || isClosing;

  const handleClose = useCallback(() => {
    setIsClosing(true);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (previousPathnameRef.current === pathname) return;

    previousPathnameRef.current = pathname;
    handleClose();
  }, [pathname, handleClose]);

  useEffect(() => {
    if (!shouldRender) return;

    const blockBackgroundScroll = (event: Event) => {
      const panel = panelRef.current;
      if (panel?.contains(event.target as Node)) return;

      event.preventDefault();
    };

    window.addEventListener("wheel", blockBackgroundScroll, { passive: false });
    window.addEventListener("touchmove", blockBackgroundScroll, {
      passive: false,
    });

    return () => {
      window.removeEventListener("wheel", blockBackgroundScroll);
      window.removeEventListener("touchmove", blockBackgroundScroll);
    };
  }, [shouldRender]);

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
    <div className="fixed inset-0 z-60 md:hidden">
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
            {menuLinks.map(({ label, href }) => (
              <li key={href}>
                <Link href={href} onClick={handleClose} className={linkClassName}>
                  {label}
                </Link>
              </li>
            ))}
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
