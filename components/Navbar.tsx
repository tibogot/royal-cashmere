"use client";

import BurgerButton from "@/components/BurgerButton";
import BoutiqueNavMenu from "@/components/BoutiqueNavMenu";
import CartNavLink from "@/components/CartNavLink";
import CartPanel from "@/components/CartPanel";
import MobileNavMenu from "@/components/MobileNavMenu";
import SearchIcon from "@/components/SearchIcon";
import SearchPanel from "@/components/SearchPanel";
import { routes } from "@/lib/routes";
import type { ShopifyCollection } from "@/lib/shopify/queries";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const DURATION = 0.48;
const EASE = "power2.out";
const CLOSE_EASE = "power2.inOut";
const MENU_CONTENT_OFFSET = 6;
const CONTENT_REVEAL_AT = 0.22;
const TRANSPARENT_NAV_SECTION_ID = "home-hero";

type NavAppearance = {
  white: boolean;
  expanded: boolean;
  immediate?: boolean;
};

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === routes.home;
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [navHovered, setNavHovered] = useState(false);
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [navSolid, setNavSolid] = useState(pathname !== routes.home);
  const headerRef = useRef<HTMLElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuInnerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLSpanElement>(null);
  const navTweenRef = useRef<gsap.core.Timeline | null>(null);

  const isNavWhite = !isHome || navSolid || navHovered;

  const runNavAnimation = ({
    white,
    expanded,
    immediate = false,
  }: NavAppearance) => {
    const nav = navRef.current;
    const bg = bgRef.current;
    const menu = menuRef.current;
    const menuInner = menuInnerRef.current;
    const logo = logoRef.current;
    if (!nav || !bg || !logo) return;

    const links = nav.querySelectorAll<HTMLElement>("[data-nav-link]");
    const navHeight = nav.offsetHeight;
    const menuHeight = menuInner?.offsetHeight ?? 0;
    const duration = immediate ? 0 : DURATION;
    const colorAt = duration * 0.52;

    navTweenRef.current?.kill();
    gsap.set(bg, { transformOrigin: "top center" });

    const tl = gsap.timeline({
      defaults: { duration, ease: EASE, overwrite: "auto" },
    });
    navTweenRef.current = tl;

    const bgScaleY = Number(gsap.getProperty(bg, "scaleY") ?? 0);
    const bgVisible = bgScaleY > 0.01;
    const menuCurrentH = menu ? Number(gsap.getProperty(menu, "height") ?? 0) : 0;
    const menuIsOpen = menuCurrentH > 1;

    if (white) {
      tl.set(links, { color: "#000000" }, 0);
      tl.set(logo, { filter: "brightness(0)" }, 0);

      const showMenu = expanded && menu != null && menuInner != null && menuHeight > 0;

      if (showMenu) {
        if (!menuIsOpen) {
          tl.set(menuInner, { autoAlpha: 0, y: MENU_CONTENT_OFFSET }, 0);
        }

        tl.to(
          bg,
          {
            scaleY: 1,
            height: navHeight + menuHeight,
            duration: duration * (bgVisible ? 1 : 1.1),
          },
          0,
        );
        tl.to(menu, { height: menuHeight, duration: duration * 1.1 }, 0);
        tl.to(
          menuInner,
          {
            autoAlpha: 1,
            y: 0,
            duration: duration * 0.7,
          },
          duration * CONTENT_REVEAL_AT,
        );
      } else if (menuIsOpen && menu && menuInner) {
        tl.to(
          menuInner,
          {
            autoAlpha: 0,
            y: MENU_CONTENT_OFFSET,
            duration: duration * 0.28,
            ease: "power1.out",
          },
          0,
        );
        tl.to(menu, { height: 0, ease: CLOSE_EASE }, 0);
        tl.to(bg, { scaleY: 1, height: navHeight, ease: CLOSE_EASE }, 0);
      } else {
        if (menu) tl.set(menu, { height: 0 });
        if (menuInner) tl.set(menuInner, { autoAlpha: 0, y: MENU_CONTENT_OFFSET });
        tl.to(bg, { scaleY: 1, height: navHeight, duration: duration * 0.75 }, 0);
      }
    } else {
      if (menuIsOpen && menu && menuInner) {
        tl.to(
          menuInner,
          {
            autoAlpha: 0,
            y: MENU_CONTENT_OFFSET,
            duration: duration * 0.28,
            ease: "power1.out",
          },
          0,
        );
        tl.to(menu, { height: 0, ease: CLOSE_EASE }, 0);
        tl.to(bg, { scaleY: 0, height: navHeight, ease: CLOSE_EASE }, 0);
      } else {
        if (menu) tl.set(menu, { height: 0 });
        if (menuInner) tl.set(menuInner, { autoAlpha: 0, y: MENU_CONTENT_OFFSET });
        tl.to(bg, { scaleY: 0, height: navHeight, ease: CLOSE_EASE }, 0);
      }
      tl.to(links, { color: "#ffffff", duration: duration * 0.35 }, colorAt);
      tl.to(logo, { filter: "brightness(1)", duration: duration * 0.35 }, colorAt);
    }

    if (immediate) {
      tl.progress(1, false);
    }
  };

  useGSAP(
    () => {
      const header = headerRef.current;
      const bg = bgRef.current;
      const menu = menuRef.current;
      const menuInner = menuInnerRef.current;
      const nav = navRef.current;
      if (!header || !bg || !nav) return;

      const navHeight = nav.offsetHeight;

      gsap.set(bg, {
        transformOrigin: "top center",
        scaleY: 0,
        height: navHeight,
      });

      if (menu) {
        gsap.set(menu, { height: 0, overflow: "hidden" });
      }

      if (menuInner) {
        gsap.set(menuInner, { autoAlpha: 0, y: MENU_CONTENT_OFFSET });
      }

      if (!isHome) {
        setNavSolid(true);
        return;
      }

      const transparentSection = document.getElementById(TRANSPARENT_NAV_SECTION_ID);
      if (!transparentSection) {
        setNavSolid(true);
        return;
      }

      setNavSolid(transparentSection.getBoundingClientRect().bottom <= 0);

      const transparentSectionTrigger = ScrollTrigger.create({
        trigger: transparentSection,
        start: "bottom top",
        onEnter: () => setNavSolid(true),
        onLeaveBack: () => setNavSolid(false),
      });

      ScrollTrigger.refresh();

      return () => transparentSectionTrigger.kill();
    },
    { scope: headerRef, dependencies: [isHome, pathname] },
  );

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      runNavAnimation({
        white: isNavWhite,
        expanded: shopMenuOpen,
        immediate: reduceMotion,
      });
    },
    {
      scope: headerRef,
      dependencies: [isNavWhite, shopMenuOpen, collections.length, isHome],
    },
  );

  useGSAP(
    () => {
      const menuInner = menuInnerRef.current;
      const menu = menuRef.current;
      const bg = bgRef.current;
      const nav = navRef.current;
      if (!menuInner || !menu || !bg || !nav || !shopMenuOpen) return;

      const observer = new ResizeObserver(() => {
        const navHeight = nav.offsetHeight;
        const menuHeight = menuInner.offsetHeight;

        gsap.to(menu, {
          height: menuHeight,
          duration: DURATION * 0.35,
          ease: EASE,
          overwrite: "auto",
        });
        gsap.to(bg, {
          height: navHeight + menuHeight,
          duration: DURATION * 0.35,
          ease: EASE,
          overwrite: "auto",
        });
      });

      observer.observe(menuInner);
      return () => observer.disconnect();
    },
    {
      scope: headerRef,
      dependencies: [shopMenuOpen],
    },
  );

  const navLinkClassName = `animated-underline w-fit text-xs uppercase tracking-wide ${
    isHome && !isNavWhite ? "text-white" : "text-black"
  }`;

  const navIconButtonClassName =
    "flex h-8 w-8 items-center justify-center text-xs uppercase tracking-wide";

  const burgerLineClassName = isNavWhite ? "bg-black" : "bg-white";

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

  const openShopMenu = () => {
    setShopMenuOpen(true);
  };

  const closeShopMenu = () => {
    setShopMenuOpen(false);
  };

  useEffect(() => {
    let cancelled = false;

    fetch("/api/collections")
      .then((response) => response.json())
      .then((data: { collections?: ShopifyCollection[] }) => {
        if (!cancelled && data.collections) {
          setCollections(data.collections);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

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
        ref={shellRef}
        className="relative"
        onMouseEnter={() => setNavHovered(true)}
        onMouseLeave={() => {
          setNavHovered(false);
          setShopMenuOpen(false);
        }}
      >
        <div
          ref={bgRef}
          className="pointer-events-none absolute inset-x-0 top-0 bg-white"
          aria-hidden="true"
        />

        <nav
          ref={navRef}
          className="relative grid grid-cols-[1fr_auto_1fr] select-none items-center px-4 py-4 md:px-8 md:py-5"
        >
          <div className="flex items-center gap-4 md:gap-8">
            <div
              className="flex items-center gap-3 md:hidden"
              onMouseEnter={closeShopMenu}
            >
              {!menuOpen ? (
                <BurgerButton
                  open={menuOpen}
                  onClick={handleMenuToggle}
                  className={navIconButtonClassName}
                  lineClassName={burgerLineClassName}
                />
              ) : null}
              <button
                type="button"
                onClick={handleSearchOpen}
                aria-label="Rechercher"
                className={navIconButtonClassName}
                data-nav-link
              >
                <SearchIcon />
              </button>
            </div>

            <ul className="hidden items-center md:flex">
              <li onMouseEnter={openShopMenu} onFocus={openShopMenu}>
                <Link href={routes.shop} className={navLinkClassName} data-nav-link>
                  Boutique
                </Link>
              </li>
            </ul>
            <ul
              className="hidden items-center gap-6 md:flex md:gap-8"
              onMouseEnter={closeShopMenu}
            >
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
            onMouseEnter={closeShopMenu}
          >
            <span ref={logoRef} className="inline-flex">
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

          <div
            className="flex items-center justify-end gap-6 md:gap-8"
            onMouseEnter={closeShopMenu}
          >
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

        <div
          ref={menuRef}
          className="relative hidden h-0 overflow-hidden md:block"
          aria-hidden={!shopMenuOpen}
          onMouseEnter={openShopMenu}
        >
          <div ref={menuInnerRef}>
            <BoutiqueNavMenu collections={collections} />
          </div>
        </div>
      </div>

      <MobileNavMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onCartOpen={handleCartOpen}
        collections={collections}
      />
      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartPanel open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}

const leftLinks = [
  { label: "Collection", href: routes.collection },
  { label: "À propos", href: routes.about },
  { label: "Contact", href: routes.contact },
] as const;

const rightLinks = [{ label: "Mon compte", href: routes.account }] as const;
