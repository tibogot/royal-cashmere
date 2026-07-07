"use client";

import { showcaseCategories } from "@/lib/categories";
import { ctaLinkClassName } from "@/lib/ui";
import FadeInImage from "@/components/FadeInImage";
import Link from "next/link";
import { useState } from "react";

const defaultIndex = showcaseCategories.findIndex(
  (category) => category.label === "Pantalons",
);

export default function CategoryShowcase() {
  const [activeIndex, setActiveIndex] = useState(
    defaultIndex >= 0 ? defaultIndex : 0,
  );

  const categoryCount = showcaseCategories.length;
  const prevIndex = (activeIndex - 1 + categoryCount) % categoryCount;
  const nextIndex = (activeIndex + 1) % categoryCount;

  const current = showcaseCategories[activeIndex];
  const prev = showcaseCategories[prevIndex];
  const next = showcaseCategories[nextIndex];

  return (
    <section className="bg-white px-4 py-24 text-black md:px-8 md:py-32">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-6 md:gap-12 lg:gap-20">
        <button
          type="button"
          onClick={() => setActiveIndex(prevIndex)}
          className="hidden max-w-32 shrink-0 select-none font-serif text-3xl uppercase leading-none transition-opacity hover:opacity-60 sm:block md:max-w-none md:text-5xl lg:text-6xl"
        >
          {prev.label}
        </button>

        <div className="flex min-w-0 flex-1 flex-col items-center">
          <div className="relative aspect-3/4 w-full max-w-[280px] md:max-w-[360px]">
            <FadeInImage
              key={current.image}
              src={current.image}
              alt={current.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 280px, 360px"
            />
            <h2 className="absolute inset-0 flex items-center justify-center px-4 text-center font-serif text-3xl uppercase leading-none text-white md:text-5xl lg:text-6xl">
              {current.label}
            </h2>
          </div>

          <div className="mt-8 flex w-full max-w-[280px] items-center justify-between sm:hidden md:max-w-[360px]">
            <button
              type="button"
              onClick={() => setActiveIndex(prevIndex)}
              className="select-none font-serif text-2xl uppercase leading-none transition-opacity hover:opacity-60"
            >
              {prev.label}
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex(nextIndex)}
              className="select-none font-serif text-2xl uppercase leading-none transition-opacity hover:opacity-60"
            >
              {next.label}
            </button>
          </div>

          <Link
            href={current.href}
            className={`${ctaLinkClassName} mt-8 md:mt-10`}
          >
            Découvrir
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setActiveIndex(nextIndex)}
          className="hidden max-w-32 shrink-0 select-none font-serif text-3xl uppercase leading-none transition-opacity hover:opacity-60 sm:block md:max-w-none md:text-5xl lg:text-6xl"
        >
          {next.label}
        </button>
      </div>
    </section>
  );
}
