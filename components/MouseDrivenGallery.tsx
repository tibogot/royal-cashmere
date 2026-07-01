"use client";

import { mouseDrivenGalleryItems } from "@/components/mouse-driven-gallery-items";
import styles from "@/components/MouseDrivenGallery.module.css";
import { useEffect, useRef } from "react";

export default function MouseDrivenGallery() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    // Matches script.js from the vanilla repo exactly.
    const handleMouseMove = (event: MouseEvent) => {
      const percent = event.clientX / window.innerWidth;

      nav.animate(
        {
          transform: `translateX(${percent * nav.offsetWidth * -1}px)`,
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
    <section className={styles.stage} aria-label="Galerie interactive">
      <nav ref={navRef} id="nav" className={styles.nav} aria-label="Collections">
        {mouseDrivenGalleryItems.map((item) => (
          <a key={item.id} href={item.href} className={styles.link}>
            <span className={styles.label}>
              <span className={styles.labelText}>{item.title}</span>
              <div className={styles.imgWrapper}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.title} className={styles.image} />
              </div>
            </span>
          </a>
        ))}
      </nav>
    </section>
  );
}
