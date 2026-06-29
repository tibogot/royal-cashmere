"use client";

import BurgerButton from "@/components/BurgerButton";
import CartNavLink from "@/components/CartNavLink";
import CartPanel from "@/components/CartPanel";
import MobileNavMenu from "@/components/MobileNavMenu";
import SearchIcon from "@/components/SearchIcon";
import SearchPanel from "@/components/SearchPanel";
import { routes } from "@/lib/routes";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

const NAV_ANIM_DURATION = 0.45;

const leftLinks = [
  { label: "Boutique", href: routes.shop },
  { label: "Collection", href: routes.collection },
  { label: "À propos", href: routes.about },
  { label: "Contact", href: routes.contact },
] as const;

const rightLinks = [{ label: "Mon compte", href: routes.account }] as const;

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === routes.home;
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const header = headerRef.current;
    const bg = bgRef.current;
    const nav = navRef.current;
    const logo = logoRef.current;
    if (!header || !bg || !nav || !logo) return;

    const links = nav.querySelectorAll<HTMLElement>("[data-nav-link]");

    const setSolid = (solid: boolean, immediate = false) => {
      const duration = immediate ? 0 : NAV_ANIM_DURATION;

      gsap.to(bg, {
        opacity: solid ? 1 : 0,
        duration,
        ease: "power2.inOut",
        overwrite: true,
      });
      gsap.to(links, {
        color: solid ? "#000000" : "#ffffff",
        duration,
        ease: "power2.inOut",
        overwrite: true,
      });
      gsap.to(logo, {
        filter: solid ? "brightness(0)" : "brightness(1)",
        duration,
        ease: "power2.inOut",
        overwrite: true,
      });
    };

    const ctx = gsap.context(() => {
      if (!isHome) {
        setSolid(true, true);
        return;
      }

      setSolid(false, true);

      const hero = document.getElementById("home-hero");
      if (!hero) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      ScrollTrigger.create({
        trigger: hero,
        start: "bottom top",
        onEnter: () => setSolid(true, reduceMotion),
        onLeaveBack: () => setSolid(false, reduceMotion),
      });

      ScrollTrigger.refresh();
    }, header);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, [isHome, pathname]);

  const navLinkClassName = `text-xs uppercase tracking-wide transition-opacity hover:opacity-60 ${
    isHome ? "text-white" : "text-black"
  }`;

  const handleMenuToggle = () => {
    setMenuOpen((current) => !current);
  };

  const handleSearchOpen = () => {
    setMenuOpen(false);
    setCartOpen(false);
    setSearchOpen(true);
  };

  const handleCartOpen = () => {
    setMenuOpen(false);
    setSearchOpen(false);
    setCartOpen(true);
  };

  useEffect(() => {
    const handleCartOpenEvent = () => {
      setMenuOpen(false);
      setSearchOpen(false);
      setCartOpen(true);
    };

    const handleSearchOpenEvent = () => {
      setMenuOpen(false);
      setCartOpen(false);
      setSearchOpen(true);
    };

    window.addEventListener("cart-open", handleCartOpenEvent);
    window.addEventListener("search-open", handleSearchOpenEvent);
    return () => {
      window.removeEventListener("cart-open", handleCartOpenEvent);
      window.removeEventListener("search-open", handleSearchOpenEvent);
    };
  }, []);

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50">
      <div
        ref={bgRef}
        className={`pointer-events-none absolute inset-0 bg-white ${
          isHome ? "opacity-0" : "opacity-100"
        }`}
        aria-hidden="true"
      />

      <nav
        ref={navRef}
        className="relative grid grid-cols-[1fr_auto_1fr] select-none items-center px-4 py-4 md:px-8 md:py-5"
      >
        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex items-center gap-3 md:hidden">
            {!menuOpen ? (
              <BurgerButton
                open={menuOpen}
                onClick={handleMenuToggle}
                className={navLinkClassName}
              />
            ) : null}
            <button
              type="button"
              onClick={handleSearchOpen}
              aria-label="Rechercher"
              className={`flex h-8 w-8 items-center justify-center transition-opacity hover:opacity-60 ${navLinkClassName}`}
              data-nav-link
            >
              <SearchIcon />
            </button>
          </div>

          <ul className="hidden items-center gap-6 md:flex md:gap-8">
            {leftLinks.map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className={navLinkClassName} data-nav-link>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <Link
          href={routes.home}
          className="justify-self-center"
          aria-label="Royal Cashmere accueil"
        >
          <span
            ref={logoRef}
            className={`inline-flex ${isHome ? "" : "brightness-0"}`}
          >
            <Image
              src="/brand/logo-nav.svg"
              alt="Royal Cashmere"
              width={224}
              height={18}
              priority
              className="h-3.5 w-auto md:h-4"
            />
          </span>
        </Link>

        <div className="flex items-center justify-end gap-6 md:gap-8">
          <ul className="hidden items-center gap-6 md:flex md:gap-8">
            <li>
              <button
                type="button"
                onClick={handleSearchOpen}
                className={navLinkClassName}
                data-nav-link
              >
                Rechercher
              </button>
            </li>
            {rightLinks.map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className={navLinkClassName} data-nav-link>
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <CartNavLink
                className={navLinkClassName}
                data-nav-link
                onClick={handleCartOpen}
              />
            </li>
          </ul>

          <div className="md:hidden">
            <CartNavLink
              className={navLinkClassName}
              data-nav-link
              onClick={handleCartOpen}
            />
          </div>
        </div>
      </nav>

      <MobileNavMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onCartOpen={handleCartOpen}
      />
      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartPanel open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
