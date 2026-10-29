import PortableTextContent from "@/components/PortableTextContent";
import SanityImage from "@/components/SanityImage";
import ScrollShrinkImage from "@/components/ScrollShrinkImage";
import SplitTextReveal from "@/components/SplitTextReveal";
import { formatArticleDate } from "@/lib/sanity/format";
import { urlFor } from "@/lib/sanity/image";
import {
  getJournalArticleBySlug,
  getJournalArticleSlugs,
} from "@/lib/sanity/queries";
import type {
  JournalArticle,
  SanityImage as SanityImageData,
} from "@/lib/sanity/types";
import { createPageMetadata, toMetaDescription } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site";
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
    description: toMetaDescription(article.excerpt),
    path: routes.journalArticle(slug),
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
function articleJsonLd(article: JournalArticle, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: toMetaDescription(article.excerpt),
    url: `${siteConfig.url}${routes.journalArticle(slug)}`,
    mainEntityOfPage: `${siteConfig.url}${routes.journalArticle(slug)}`,
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
    inLanguage: "fr-BE",
  };
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd(article, slug)),
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
            Retour au journal
          </Link>
        </section>
      </article>
    </main>
  );
}
