import type { Metadata } from "next";
import { toLocale } from "@/lib/i18n/config";
import JournalArticleCard from "@/components/JournalArticleCard";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { createPageMetadata } from "@/lib/seo";
import { getJournalArticles } from "@/lib/sanity/queries";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/journal">): Promise<Metadata> {
  const { lang } = await params;
  const locale = toLocale(lang);
  const { shopMeta } = await getDictionary(locale);
  return createPageMetadata({
    locale,
    title: shopMeta.journalTitle,
    description: shopMeta.journalDescription,
    path: "/journal",
  });
}

export default async function JournalPage({
  params,
}: PageProps<"/[lang]/journal">) {
  const locale = toLocale((await params).lang);
  const [articles, dict] = await Promise.all([
    getJournalArticles(locale),
    getDictionary(locale),
  ]);

  return (
    <main className="w-full">
      <h1 className="sr-only">{dict.journal.title}</h1>

      <section className="bg-white px-4 pt-24 pb-24 md:px-8 md:pt-28 md:pb-32">
        {articles.length > 0 ? (
          <div className="grid gap-12 md:grid-cols-2 md:gap-x-8 md:gap-y-16 lg:grid-cols-3">
            {articles.map((article) => (
              <JournalArticleCard
                key={article._id}
                article={article}
                locale={locale}
              />
            ))}
          </div>
        ) : (
          <p className="mx-auto max-w-xl text-center font-serif text-sm text-black/70 md:text-base">
            {dict.journal.empty}
          </p>
        )}
      </section>
    </main>
  );
}
