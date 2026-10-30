import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { sanityClient, sanityFetchOptions } from "./client";
import type {
  ArticleTranslation,
  HomePageContent,
  JournalArticle,
  JournalArticleListItem,
} from "./types";

/**
 * A translated short string (internationalized-array field) in `$locale`,
 * falling back to French.
 */
function localized(field: string) {
  return `coalesce(${field}[language == $locale][0].value, ${field}[language == "${DEFAULT_LOCALE}"][0].value)`;
}

// Every translation of an article, its own language included, through the
// metadata document the document-internationalization plugin maintains.
const translationsField = `"translations": *[
  _type == "translation.metadata" && references(^._id)
][0].translations[].value->{
  language,
  "slug": slug.current
}`;

const articleListFields = `
  _id,
  _updatedAt,
  title,
  slug,
  language,
  publishedAt,
  excerpt,
  mainImage,
  author->{ name },
  categories[]->{ "title": coalesce(${localized("titleTranslations")}, title) }
`;

export const articlesQuery = `*[_type == "article" && language == $language] | order(publishedAt desc) {
  ${articleListFields}
}`;

// By slug in any language: the page decides what to do with an article that
// is not in the language of the URL.
export const articleBySlugQuery = `*[_type == "article" && slug.current == $slug][0] {
  ${articleListFields},
  body,
  ${translationsField}
}`;

export const articleSlugsQuery = `*[_type == "article" && defined(slug.current)]{
  "slug": slug.current,
  language,
  _updatedAt,
  ${translationsField}
}`;

function hotspotImageFields() {
  return `..., "lqip": asset->metadata.lqip, "alt": ${localized("alt")}`;
}

export const homePageQuery = `*[_type == "homePage" && _id == "homePage"][0] {
  saleCardImage { ${hotspotImageFields()} },
  bestsellersCardImage { ${hotspotImageFields()} },
  storyBannerImage { ${hotspotImageFields()} },
  newInCardImage { ${hotspotImageFields()} },
  boutiqueVisitImage { ${hotspotImageFields()} }
}`;

export async function getHomePageContent(
  locale: Locale,
): Promise<HomePageContent | null> {
  return sanityClient.fetch<HomePageContent | null>(
    homePageQuery,
    { locale },
    sanityFetchOptions,
  );
}

/**
 * The journal in one language. A language with no articles of its own yet
 * shows the French ones — each card links to the article in its own language —
 * rather than an empty page.
 */
export async function getJournalArticles(
  locale: Locale,
): Promise<JournalArticleListItem[]> {
  const fetchIn = (language: Locale) =>
    sanityClient.fetch<JournalArticleListItem[]>(
      articlesQuery,
      { language, locale },
      sanityFetchOptions,
    );

  const articles = await fetchIn(locale);
  if (articles.length > 0 || locale === DEFAULT_LOCALE) return articles;

  return fetchIn(DEFAULT_LOCALE);
}

export async function getJournalArticleBySlug(
  slug: string,
  locale: Locale,
): Promise<JournalArticle | null> {
  return sanityClient.fetch<JournalArticle | null>(
    articleBySlugQuery,
    { slug, locale },
    sanityFetchOptions,
  );
}

export async function getJournalArticleSitemapEntries(): Promise<
  {
    slug: string;
    language: Locale;
    _updatedAt: string;
    translations: ArticleTranslation[] | null;
  }[]
> {
  const rows = await sanityClient.fetch<
    {
      slug: string;
      language: Locale;
      _updatedAt: string;
      translations: ArticleTranslation[] | null;
    }[]
  >(articleSlugsQuery, {}, sanityFetchOptions);

  return rows.filter((row) => Boolean(row.slug));
}

/** The slugs written in one language, for that language's static pages. */
export async function getJournalArticleSlugs(
  locale: Locale,
): Promise<string[]> {
  const rows = await getJournalArticleSitemapEntries();
  return rows.filter((row) => row.language === locale).map((row) => row.slug);
}

/** Each language's slug for an article, keyed by language. */
export function articleSlugsByLocale(article: {
  slug: string;
  language: Locale;
  translations?: ArticleTranslation[] | null;
}): Partial<Record<Locale, string>> {
  const slugs: Partial<Record<Locale, string>> = {
    [article.language]: article.slug,
  };

  for (const translation of article.translations ?? []) {
    if (translation?.language && translation.slug) {
      slugs[translation.language] = translation.slug;
    }
  }

  return slugs;
}
