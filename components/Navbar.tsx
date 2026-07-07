"use client";

import BurgerButton from "@/components/BurgerButton";
import BoutiqueNavMenu from "@/components/BoutiqueNavMenu";
import CartNavLink from "@/components/CartNavLink";
import CartPanel from "@/components/CartPanel";
import MobileNavMenu from "@/components/MobileNavMenu";
import SearchIcon from "@/components/SearchIcon";
import SearchPanel from "@/components/SearchPanel";
import WishlistNavLink from "@/components/WishlistNavLink";
import { routes } from "@/lib/routes";
import type { ShopifyCollection } from "@/lib/shopify/queries";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const DURATION = 0.48;
const EASE = "power2.out";
const CLOSE_EASE = "power2.inOut";
const MENU_CONTENT_OFFSET = 6;
const CONTENT_REVEAL_AT = 0.22;
const TRANSPARENT_NAV_SELECTOR = "[data-transparent-nav]";
const TRANSPARENT_NAV_PATHS = new Set([routes.home, routes.about]);

type NavAppearance = {
  white: boolean;
  expanded: boolean;
  immediate?: boolean;
};

export default function Navbar() {
  const pathname = usePathname();
  const hasTransparentHero = TRANSPARENT_NAV_PATHS.has(pathname);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [navHovered, setNavHovered] = useState(false);
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [navSolid, setNavSolid] = useState(!hasTransparentHero);
  const headerRef = useRef<HTMLElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuInnerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLSpanElement>(null);
  const navTweenRef = useRef<gsap.core.Timeline | null>(null);
  const menuMeasureAttemptsRef = useRef(0);
  const navExpandedRef = useRef(false);
  const hasTransparentHeroRef = useRef(hasTransparentHero);

  const overlayOpen = cartOpen || searchOpen;
  const isNavWhite = hasTransparentHero
    ? navSolid || navHovered || overlayOpen
    : true;
  const navExpanded = shopMenuOpen && !overlayOpen;

  // Mirror the latest values into refs for the ScrollTrigger and ResizeObserver
  // callbacks below (which read them asynchronously), without writing to refs
  // during render.
  useEffect(() => {
    hasTransparentHeroRef.current = hasTransparentHero;
    navExpandedRef.current = navExpanded;
  });

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

    navTweenRef.current?.kill();
    if (menu) gsap.killTweensOf(menu);
    if (menuInner) gsap.killTweensOf(menuInner);
    gsap.killTweensOf(bg);

    const links = nav.querySelectorAll<HTMLElement>("[data-nav-link]");
    const navHeight = nav.offsetHeight;
    const menuHeight = expanded && menuInner
      ? Math.max(menuInner.offsetHeight, menuInner.scrollHeight)
      : 0;
    const duration = immediate ? 0 : DURATION;
    const colorAt = duration * 0.52;

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

    if (expanded && menuInner && menuHeight === 0 && menuMeasureAttemptsRef.current < 2) {
      menuMeasureAttemptsRef.current += 1;
      requestAnimationFrame(() => {
        runNavAnimation({ white, expanded, immediate });
      });
      return;
    }

    if (menuHeight > 0) {
      menuMeasureAttemptsRef.current = 0;
    }
  };

  useGSAP(
    () => {
      const bg = bgRef.current;
      const nav = navRef.current;
      if (!bg || !nav) return;

      const navHeight = nav.offsetHeight;

      if (!hasTransparentHero) {
        setNavSolid(true);
        return;
      }

      const isHovered = shellRef.current?.matches(":hover") ?? false;
      if (!isHovered) {
        gsap.set(bg, {
          transformOrigin: "top center",
          scaleY: 0,
          height: navHeight,
        });
      }

      const transparentSection = document.querySelector(TRANSPARENT_NAV_SELECTOR);
      if (!transparentSection) {
        setNavSolid(true);
        return;
      }

      setNavSolid(transparentSection.getBoundingClientRect().bottom <= 0);

      const transparentSectionTrigger = ScrollTrigger.create({
        trigger: transparentSection,
        start: "bottom top",
        onEnter: () => {
          if (hasTransparentHeroRef.current) setNavSolid(true);
        },
        onLeaveBack: () => {
          if (hasTransparentHeroRef.current) setNavSolid(false);
        },
      });

      return () => transparentSectionTrigger.kill();
    },
    { scope: headerRef, dependencies: [hasTransparentHero, pathname] },
  );

  useGSAP(
    () => {
      const menu = menuRef.current;
      const menuInner = menuInnerRef.current;
      if (!menu || !menuInner) return;

      gsap.set(menu, { height: 0, overflow: "hidden" });
      gsap.set(menuInner, { autoAlpha: 0, y: MENU_CONTENT_OFFSET });
    },
    { scope: headerRef },
  );

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      runNavAnimation({
        white: isNavWhite,
        expanded: navExpanded,
        immediate: reduceMotion || overlayOpen,
      });
    },
    {
      scope: headerRef,
      dependencies: [
        isNavWhite,
        navExpanded,
        collections.length,
        hasTransparentHero,
        overlayOpen,
      ],
    },
  );

  useGSAP(
    () => {
      const menuInner = menuInnerRef.current;
      const menu = menuRef.current;
      const bg = bgRef.current;
      const nav = navRef.current;
      if (!menuInner || !menu || !bg || !nav || !navExpanded) return;

      const observer = new ResizeObserver(() => {
        if (!navExpandedRef.current) return;

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
      dependencies: [navExpanded],
    },
  );

  const navLinkClassName = `animated-underline w-fit text-xs uppercase tracking-wide ${
    hasTransparentHero && !isNavWhite ? "text-white" : "text-black"
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
    setShopMenuOpen(false);
    setSearchOpen(true);
  };

  const handleCartOpen = () => {
    setMenuOpen(false);
    setSearchOpen(false);
    setShopMenuOpen(false);
    setCartOpen(true);
  };

  const openShopMenu = () => {
    if (cartOpen || searchOpen || menuOpen) return;
    setShopMenuOpen(true);
  };

  const closeShopMenu = () => {
    setShopMenuOpen(false);
  };

  useLayoutEffect(() => {
    if (!overlayOpen) return;

    // Note: shopMenuOpen is already reset to false by every path that opens an
    // overlay (handleCartOpen / handleSearchOpen and the window-event
    // handlers), so this effect only needs to run the appearance animation.
    menuMeasureAttemptsRef.current = 0;

    runNavAnimation({
      white: hasTransparentHero ? navSolid || navHovered || overlayOpen : true,
      expanded: false,
      immediate: true,
    });
  }, [overlayOpen, hasTransparentHero, navSolid, navHovered]);

  useLayoutEffect(() => {
    if (navExpanded) return;

    const menu = menuRef.current;
    const bg = bgRef.current;
    const nav = navRef.current;
    if (!menu || !bg || !nav) return;

    const menuCurrentH = Number(gsap.getProperty(menu, "height") ?? 0);
    const navHeight = nav.offsetHeight;
    const bgHeight = Number(gsap.getProperty(bg, "height") ?? 0);

    if (menuCurrentH <= 1 && bgHeight <= navHeight + 1) return;

    runNavAnimation({
      white: hasTransparentHero ? navSolid || navHovered || overlayOpen : true,
      expanded: false,
      immediate: true,
    });
  }, [navExpanded, hasTransparentHero, navSolid, navHovered, overlayOpen]);

  // Reset nav UI state on navigation. The navbar is mounted once and persists
  // across routes, so it can't be reset via a `key` remount; these resets
  // legitimately run in an effect (they also depend on reading the hovered DOM
  // state below, which isn't available during render).
  useLayoutEffect(() => {
    if (!hasTransparentHero) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- see note above
      setNavSolid(true);
    }
    setShopMenuOpen(false);
    menuMeasureAttemptsRef.current = 0;

    // The navbar persists across routes; if the pointer never left it,
    // onMouseEnter won't fire again after navigation.
    const isHovered = shellRef.current?.matches(":hover") ?? false;
    setNavHovered(isHovered);

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    runNavAnimation({
      white: !hasTransparentHero || isHovered,
      expanded: false,
      immediate: reduceMotion || !hasTransparentHero,
    });
  }, [pathname, hasTransparentHero]);

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
      setShopMenuOpen(false);
      setCartOpen(true);
    };

    const handleSearchOpenEvent = () => {
      setMenuOpen(false);
      setCartOpen(false);
      setShopMenuOpen(false);
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
          if (!cartOpen && !searchOpen) {
            setShopMenuOpen(false);
          }
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
                <WishlistNavLink
                  className={navLinkClassName}
                  data-nav-link
                />
              </li>
              <li onMouseEnter={closeShopMenu}>
                <CartNavLink
                  className={navLinkClassName}
                  data-nav-link
                  onClick={handleCartOpen}
                />
              </li>
            </ul>

            <div className="flex items-center gap-6 md:hidden">
              <WishlistNavLink
                className={navLinkClassName}
                data-nav-link
              />
              <CartNavLink
                className={navLinkClassName}
                data-nav-link
                onClick={handleCartOpen}
                onMouseEnter={closeShopMenu}
              />
            </div>
          </div>
        </nav>

        <div
          ref={menuRef}
          className={`relative hidden h-0 overflow-hidden md:block ${
            navExpanded ? "" : "pointer-events-none"
          }`}
          aria-hidden={!navExpanded}
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
  { label: "Journal", href: routes.journal },
  { label: "À propos", href: routes.about },
  { label: "Contact", href: routes.contact },
] as const;

const rightLinks = [{ label: "Mon compte", href: routes.account }] as const;
