"use client";

import { useDictionary } from "@/components/LocaleProvider";
import { routes } from "@/lib/routes";
import { ctaLinkClassName } from "@/lib/ui";
import Link from "@/components/LocaleLink";

// A client component because not-found.tsx gets no params to read the
// language from; the dictionary comes from the layout's LocaleProvider.
export default function ProductNotFound() {
  const dict = useDictionary();

  return (
    <main className="flex min-h-svh w-full flex-col items-center justify-center bg-white px-4 pt-24 text-center text-black">
      <h1 className="font-serif text-3xl uppercase md:text-5xl">
        {dict.product.notFoundTitle}
      </h1>
      <p className="mt-6 max-w-md text-sm text-black/70">
        {dict.product.notFoundText}
      </p>
      <Link
        href={routes.shop}
        className={`${ctaLinkClassName} mt-10`}
      >
        {dict.product.backToShop}
      </Link>
    </main>
  );
}
