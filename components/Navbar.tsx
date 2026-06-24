"use client";

import { routes } from "@/lib/routes";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const NAV_ANIM_DURATION = 0.45;

const leftLinks = [
  { label: "Boutique", href: routes.shop },
  { label: "Collection", href: routes.collection },
  { label: "À propos", href: routes.about },
] as const;

const rightLinks = [
  { label: "Recherche", href: routes.search },
  { label: "Connexion", href: routes.signIn },
  { label: "Panier (0)", href: routes.cart },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === routes.home;
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

    const links = nav.querySelectorAll<HTMLElement>("ul a");

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

  const navLinkClassName = `text-sm uppercase tracking-wide transition-opacity hover:opacity-60 ${
    isHome ? "text-white" : "text-black"
  }`;

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
        className="relative grid grid-cols-[1fr_auto_1fr] items-center px-6 py-6 md:px-12 md:py-8"
      >
        <ul className="flex items-center gap-6 md:gap-8">
          {leftLinks.map(({ label, href }) => (
            <li key={label}>
              <Link href={href} className={navLinkClassName}>
                {label}
              </Link>
            </li>
          ))}
        </ul>

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

        <ul className="flex items-center justify-end gap-6 md:gap-8">
          {rightLinks.map(({ label, href }) => (
            <li key={label}>
              <Link href={href} className={navLinkClassName}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
