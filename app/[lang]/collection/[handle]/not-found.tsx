"use client";

import Link from "@/components/LocaleLink";
import { useDictionary } from "@/components/LocaleProvider";
import { routes } from "@/lib/routes";
import { ctaLinkClassName } from "@/lib/ui";

// A Client Component: not-found receives no params, so the copy comes from
// the layout's LocaleProvider.
export default function CollectionNotFound() {
  const { notFound } = useDictionary().catalog;

  return (
    <main className="w-full">
      <section className="bg-white px-4 pt-24 pb-20 text-center text-black md:px-8 md:pt-28 md:pb-32">
        <h1 className="font-serif text-5xl uppercase md:text-7xl">
          {notFound.title}
        </h1>
        <Link
          href={routes.shop}
          className={`${ctaLinkClassName} mt-10 inline-block`}
        >
          {notFound.backToShop}
        </Link>
      </section>
    </main>
  );
}
