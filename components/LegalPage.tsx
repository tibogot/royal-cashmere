import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { formatLongDate } from "@/lib/i18n/format";

type LegalPageProps = {
  /** The language the text is written in; dates and labels follow it. */
  locale: Locale;
  title: string;
  /** ISO date — see `legalLastUpdated` in lib/legal. */
  lastUpdated?: string;
  children: ReactNode;
};

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="font-serif text-xl uppercase tracking-wide text-black md:text-2xl">
        {title}
      </h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export function LegalParagraph({ children }: { children: ReactNode }) {
  return (
    <p className="font-serif text-sm leading-relaxed text-black/80 md:text-base">
      {children}
    </p>
  );
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 font-serif text-sm leading-relaxed text-black/80 md:text-base">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

export default async function LegalPage({
  locale,
  title,
  lastUpdated,
  children,
}: LegalPageProps) {
  const { shellLegalMeta } = await getDictionary(locale);

  return (
    <main className="w-full">
      <section className="bg-white px-4 pt-24 pb-20 text-black md:px-8 md:pt-28 md:pb-32">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-serif text-4xl uppercase leading-[1.12] md:text-6xl">
            {title}
          </h1>
          {lastUpdated ? (
            <p className="mt-6 text-xs uppercase tracking-wide text-black/50">
              {/* The label carries its own punctuation: French puts a space
                  before the colon, English and Dutch do not. */}
              {shellLegalMeta.lastUpdated} {formatLongDate(locale, lastUpdated)}
            </p>
          ) : null}
          <div className="mt-12 space-y-10">{children}</div>
        </div>
      </section>
    </main>
  );
}
