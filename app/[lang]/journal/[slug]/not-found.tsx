"use client";

import Link from "@/components/LocaleLink";
import { useDictionary } from "@/components/LocaleProvider";
import { routes } from "@/lib/routes";
import { ctaLinkClassName } from "@/lib/ui";

// A client component because not-found.tsx gets no params to read the
// language from; the dictionary comes from the layout's LocaleProvider.
export default function JournalArticleNotFound() {
  const dict = useDictionary();

  return (
    <main className="w-full">
      <section className="bg-white px-4 pt-24 pb-20 text-center text-black md:px-8 md:pt-28 md:pb-32">
        <h1 className="font-serif text-5xl uppercase md:text-7xl">
          {dict.journal.notFoundTitle}
        </h1>
        <Link
          href={routes.journal}
          className={`${ctaLinkClassName} mt-10 inline-block`}
        >
          {dict.journal.backToJournal}
        </Link>
      </section>
    </main>
  );
}
