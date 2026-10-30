import PortableTextContent from "@/components/PortableTextContent";
import SanityImage from "@/components/SanityImage";
import ScrollShrinkImage from "@/components/ScrollShrinkImage";
import SplitTextReveal from "@/components/SplitTextReveal";
import { formatArticleDate } from "@/lib/sanity/format";
import { urlFor } from "@/lib/sanity/image";
import {
  articleSlugsByLocale,
  getJournalArticleBySlug,
  getJournalArticleSlugs,
} from "@/lib/sanity/queries";
import type {
  JournalArticle,
  SanityImage as SanityImageData,
} from "@/lib/sanity/types";
import { createPageMetadata, toMetaDescription } from "@/lib/seo";
import {
  INTL_LOCALE,
  toLocale,
  withLocale,
  type Locale,
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site";
import { ctaLinkClassName } from "@/lib/ui";
import type { Metadata } from "next";
import Link from "@/components/LocaleLink";
import { notFound, redirect } from "next/navigation";

type JournalArticlePageProps = {
  params: Promise<{ lang: string; slug: string }>;
};

// Each language builds only the articles written in it; the others resolve
// on request to a redirect (see the page below).
export async function generateStaticParams({
  params,
}: {
  params: { lang: string };
}) {
  const slugs = await getJournalArticleSlugs(toLocale(params.lang));

  return slugs.map((slug) => ({ slug }));
}

/** Paths of every language version, for hreflang. */
function localizedArticlePaths(article: JournalArticle) {
  return Object.fromEntries(
    Object.entries(
      articleSlugsByLocale({
        slug: article.slug.current,
        language: article.language,
        translations: article.translations,
      }),
    ).map(([language, slug]) => [language, routes.journalArticle(slug)]),
  ) as Partial<Record<Locale, string>>;
}

export async function generateMetadata({
  params,
}: JournalArticlePageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = toLocale(lang);
  const article = await getJournalArticleBySlug(slug, locale);

  if (!article) {
    const dict = await getDictionary(locale);
    return createPageMetadata({ locale, title: dict.journal.notFoundTitle });
  }

  return createPageMetadata({
    // The article's own language: a mismatched URL redirects anyway.
    locale: article.language,
    title: article.title,
    description: toMetaDescription(article.excerpt),
    path: routes.journalArticle(slug),
    localizedPaths: localizedArticlePaths(article),
    image: article.mainImage
      ? {
          url: urlFor(article.mainImage)
            .width(1200)
            .height(630)
            .fit("crop")
            .auto("format")
            .url(),
          width: 1200,
          height: 630,
          alt: article.mainImage.alt ?? article.title,
        }
      : undefined,
    article: {
      publishedTime: article.publishedAt,
      modifiedTime: article._updatedAt,
      authors: article.author?.name ? [article.author.name] : undefined,
    },
  });
}

// The hero is 70svh tall on phones and 80svh above md, object-cover. When
// the screen is narrower than the photo's ratio at that height, the photo
// fills the height and its rendered width is height × ratio, not 100vw —
// with "100vw" phones download a small file and stretch it (blurry). The
// ratio comes from the asset id ("image-<hash>-1600x900-jpg").
function articleHeroSizes(image: SanityImageData): string {
  const match = image.asset?._ref.match(/-(\d+)x(\d+)-/);
  if (!match) return "100vw";
  const ratio = Number(match[1]) / Number(match[2]);
  const mobileVh = Math.ceil(70 * ratio);
  const desktopVh = Math.ceil(80 * ratio);
  return `(max-width: 767px) max(100vw, ${mobileVh}vh), max(100vw, ${desktopVh}vh)`;
}

// BlogPosting structured data: lets Google show the date, image and author
// in results and pick the article up for Discover.
function articleJsonLd(article: JournalArticle, slug: string, locale: Locale) {
  const url = `${siteConfig.url}${withLocale(routes.journalArticle(slug), locale)}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: toMetaDescription(article.excerpt),
    url,
    mainEntityOfPage: url,
    ...(article.mainImage
      ? {
          image: urlFor(article.mainImage)
            .width(1600)
            .auto("format")
            .url(),
        }
      : {}),
    datePublished: article.publishedAt,
    dateModified: article._updatedAt,
    author: article.author?.name
      ? { "@type": "Person", name: article.author.name }
      : { "@type": "Organization", name: siteConfig.name },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    inLanguage: INTL_LOCALE[article.language],
  };
}

export default async function JournalArticlePage({
  params,
}: JournalArticlePageProps) {
  const { lang, slug } = await params;
  const locale = toLocale(lang);
  const [article, dict] = await Promise.all([
    getJournalArticleBySlug(slug, locale),
    getDictionary(locale),
  ]);

  if (!article) {
    notFound();
  }

  // An article is published per language, each with its own slug. Reached
  // under another language — the switcher swaps only the prefix — it goes to
  // its translation in that language, or failing that, to itself.
  if (article.language !== locale) {
    const translated = localizedArticlePaths(article)[locale];
    redirect(
      translated
        ? withLocale(translated, locale)
        : withLocale(routes.journalArticle(slug), article.language),
    );
  }

  const category = article.categories?.[0]?.title;

  return (
    <main className="w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd(article, slug, locale)),
        }}
      />
      <article>
        <header className="bg-white px-4 pt-24 pb-10 text-center text-black md:px-8 md:pt-28 md:pb-16">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-wide text-black/50">
            {category ? <span>{category}</span> : null}
            {category && article.publishedAt ? (
              <span aria-hidden="true">·</span>
            ) : null}
            {article.publishedAt ? (
              <time dateTime={article.publishedAt}>
                {formatArticleDate(locale, article.publishedAt)}
              </time>
            ) : null}
            {article.author?.name ? (
              <>
                <span aria-hidden="true">·</span>
                <span>{article.author.name}</span>
              </>
            ) : null}
          </div>

          <SplitTextReveal
            as="h1"
            hiddenUntilReveal
            className="mx-auto mt-6 max-w-5xl font-serif text-5xl uppercase leading-[1.12] md:max-w-6xl md:text-8xl md:leading-[1.08]"
          >
            {article.title}
          </SplitTextReveal>
        </header>

        {article.mainImage ? (
          <div className="relative h-[70svh] w-full overflow-hidden md:h-[80svh]">
            <ScrollShrinkImage reveal hiddenUntilReveal>
              <SanityImage
                image={article.mainImage}
                alt={article.mainImage.alt ?? article.title}
                sizes={articleHeroSizes(article.mainImage)}
                width={3840}
                preload
                fade={false}
              />
            </ScrollShrinkImage>
          </div>
        ) : null}

        {article.excerpt || article.body?.length ? (
          <section className="bg-white px-4 py-16 text-black md:px-8 md:py-20">
            <div className="mx-auto max-w-2xl">
              {article.excerpt ? (
                <p className="mb-10 font-serif text-lg leading-relaxed text-black/70 md:text-xl">
                  {article.excerpt}
                </p>
              ) : null}
              {article.body?.length ? (
                <PortableTextContent value={article.body} />
              ) : null}
            </div>
          </section>
        ) : null}

        <section className="bg-white px-4 pb-24 text-center md:px-8 md:pb-32">
          <Link href={routes.journal} className={`${ctaLinkClassName} inline-block`}>
            {dict.journal.backToJournal}
          </Link>
        </section>
      </article>
    </main>
  );
}
