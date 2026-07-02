"use client";

import { routes } from "@/lib/routes";
import { useEffect, useRef } from "react";

const galleryItems = [
  {
    id: "robes",
    title: "Robes",
    image: "/images/Frame 53.jpg",
    href: routes.collectionByHandle("robes"),
  },
  {
    id: "chales",
    title: "Châles",
    image: "/images/Frame 55.jpg",
    href: routes.collectionByHandle("echarpes"),
  },
  {
    id: "bonnets",
    title: "Bonnets",
    image: "/images/1140.3 coat 1.jpg",
    href: routes.shop,
  },
  {
    id: "pulls",
    title: "Pulls",
    image: "/images/Frame 12.jpg",
    href: routes.collectionByHandle("pulls"),
  },
  {
    id: "pantalons",
    title: "Pantalons",
    image: "/images/Frame 54.jpg",
    href: routes.collectionByHandle("pantalons"),
  },
  {
    id: "echarpes",
    title: "Écharpes",
    image: "/images/Catalog+Org-1 1.jpg",
    href: routes.collectionByHandle("echarpes"),
  },
  {
    id: "manteaux",
    title: "Manteaux",
    image: "/images/0179.1 jumper 1239 pants 1.jpg",
    href: routes.shop,
  },
  {
    id: "gants",
    title: "Gants",
    image: "/images/fadhil-abhimantra.jpg",
    href: routes.shop,
  },
  {
    id: "ponchos",
    title: "Ponchos",
    image: "/images/Frame 49.jpg",
    href: routes.shop,
  },
  {
    id: "cardigans",
    title: "Cardigans",
    image: "/images/Frame 63.png",
    href: routes.collectionByHandle("pulls"),
  },
  {
    id: "cachemire",
    title: "Cachemire",
    image: "/images/ekaterina-grosheva-optimized.jpg",
    href: routes.about,
  },
  {
    id: "maille",
    title: "Maille",
    image: "/images/Desktop - 20.jpg",
    href: routes.shop,
  },
] as const;

export default function MouseDrivenGallery() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const handleMouseMove = (event: MouseEvent) => {
      const percent = event.clientX / window.innerWidth;
      const overflow = Math.max(0, nav.offsetWidth - window.innerWidth);
      const translateX = overflow * (0.5 - percent);

      nav.animate(
        {
          transform: `translateX(${translateX}px)`,
        },
        {
          fill: "forwards",
          duration: 4000,
        },
      );
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section
      className="relative h-svh w-full overflow-hidden bg-white"
      aria-label="Galerie interactive"
    >
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2">
        <nav
          ref={navRef}
          id="nav"
          className="flex w-max flex-row"
          aria-label="Collections"
        >
        {galleryItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className="group relative px-[0.4em] py-8 text-center font-serif font-medium uppercase no-underline"
          >
            <span className="relative block w-[180px] md:w-[280px]">
              <span className="relative z-2 block text-[clamp(1.125rem,4.5vw,1.5rem)] leading-none tracking-[-0.03em] text-black group-hover:text-white group-hover:mix-blend-difference md:text-[clamp(1.5rem,3vw,2.25rem)]">
                {item.title}
              </span>
              <div className="pointer-events-none absolute top-1/2 left-1/2 z-1 h-80 w-60 -translate-x-1/2 -translate-y-1/2 scale-50 overflow-hidden opacity-0 transition-all duration-250 group-hover:scale-100 group-hover:opacity-100 md:h-[480px] md:w-[360px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="pointer-events-none absolute inset-0 block h-full w-full object-cover object-center opacity-0 scale-[2.5] transition-[transform_2000ms_cubic-bezier(0.075,0.82,0.165,1.5),opacity_250ms] group-hover:scale-150 group-hover:opacity-100"
                />
              </div>
            </span>
          </a>
        ))}
        </nav>
      </div>
    </section>
  );
}
