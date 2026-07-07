import PortableTextContent from "@/components/PortableTextContent";
import SanityImage from "@/components/SanityImage";
import { formatArticleDate } from "@/lib/sanity/format";
import {
  getJournalArticleBySlug,
  getJournalArticleSlugs,
} from "@/lib/sanity/queries";
import { createPageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { ctaLinkClassName } from "@/lib/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type JournalArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getJournalArticleSlugs();

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: JournalArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getJournalArticleBySlug(slug);

  if (!article) {
    return createPageMetadata({ title: "Article introuvable" });
  }

  return createPageMetadata({
    title: article.title,
    description: article.excerpt?.slice(0, 160),
    path: routes.journalArticle(slug),
  });
}

export default async function JournalArticlePage({
  params,
}: JournalArticlePageProps) {
  const { slug } = await params;
  const article = await getJournalArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const category = article.categories?.[0]?.title;

  return (
    <main className="w-full">
      <article>
        <header className="bg-white px-4 pt-32 pb-12 text-black md:px-8 md:pt-40 md:pb-16">
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-wide text-black/50">
              {category ? <span>{category}</span> : null}
              {category && article.publishedAt ? (
                <span aria-hidden="true">·</span>
              ) : null}
              {article.publishedAt ? (
                <time dateTime={article.publishedAt}>
                  {formatArticleDate(article.publishedAt)}
                </time>
              ) : null}
              {article.author?.name ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{article.author.name}</span>
                </>
              ) : null}
            </div>

            <h1 className="mt-6 font-serif text-4xl leading-[1.12] md:text-6xl">
              {article.title}
            </h1>

            {article.excerpt ? (
              <p className="mt-6 font-serif text-base leading-relaxed text-black/70 md:text-lg">
                {article.excerpt}
              </p>
            ) : null}
          </div>
        </header>

        {article.mainImage ? (
          <div className="relative mx-auto aspect-4/5 w-full max-w-4xl bg-neutral-100 md:aspect-16/10">
            <SanityImage
              image={article.mainImage}
              alt={article.mainImage.alt ?? article.title}
              sizes="(max-width: 896px) 100vw, 896px"
              preload
            />
          </div>
        ) : null}

        {article.body?.length ? (
          <section className="bg-white px-4 py-16 text-black md:px-8 md:py-20">
            <div className="mx-auto max-w-2xl">
              <PortableTextContent value={article.body} />
            </div>
          </section>
        ) : null}

        <section className="bg-white px-4 pb-24 text-center md:px-8 md:pb-32">
          <Link href={routes.journal} className={`${ctaLinkClassName} inline-block`}>
            Retour au journal
          </Link>
        </section>
      </article>
    </main>
  );
}
