"use client";

import CartNavLink from "@/components/CartNavLink";
import { routes } from "@/lib/routes";
import gsap from "gsap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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

export default function MobileNavMenu({
  open,
  onClose,
  onCartOpen,
}: MobileNavMenuProps) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const tweenRef = useRef<gsap.core.Timeline | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  onCloseRef.current = onClose;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
    }
  }, [open]);

  useEffect(() => {
    onCloseRef.current();
  }, [pathname]);

  useEffect(() => {
    if (!isVisible) return;

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
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

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
      onComplete: () => setIsVisible(false),
    }).to(panel, {
      xPercent: -100,
      duration,
      ease: "power3.inOut",
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, [open, isVisible]);

  if (!mounted || !isVisible) return null;

  return createPortal(
    <div className="fixed inset-0 z-60 md:hidden">
      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer le menu"
        className={`fixed top-4 left-4 z-[61] flex h-8 items-center ${linkClassName}`}
      >
        Fermer
      </button>

      <div
        ref={panelRef}
        className="absolute inset-0 flex flex-col bg-white px-4 pb-6 pt-4 text-black"
        data-lenis-prevent
      >
        <nav className="mt-12 flex flex-1 flex-col">
          <ul className="flex flex-col gap-6">
            {menuLinks.map(({ label, href }) => (
              <li key={href}>
                <Link href={href} onClick={onClose} className={linkClassName}>
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <CartNavLink
                className={linkClassName}
                onClick={() => {
                  onClose();
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
