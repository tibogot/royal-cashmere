import { sanityClient, sanityFetchOptions } from "./client";
import type {
  HomePageContent,
  JournalArticle,
  JournalArticleListItem,
} from "./types";

const articleListFields = `
  _id,
  _updatedAt,
  title,
  slug,
  publishedAt,
  excerpt,
  mainImage,
  author->{ name },
  categories[]->{ title }
`;

export const articlesQuery = `*[_type == "article"] | order(publishedAt desc) {
  ${articleListFields}
}`;

export const articleBySlugQuery = `*[_type == "article" && slug.current == $slug][0] {
  ${articleListFields},
  body
}`;

export const articleSlugsQuery = `*[_type == "article" && defined(slug.current)]{
  "slug": slug.current,
  _updatedAt
}`;

const hotspotImageFields = `..., "lqip": asset->metadata.lqip`;

export const homePageQuery = `*[_type == "homePage" && _id == "homePage"][0] {
  saleCardImage { ${hotspotImageFields} },
  bestsellersCardImage { ${hotspotImageFields} },
  storyBannerImage { ${hotspotImageFields} },
  newInCardImage { ${hotspotImageFields} },
  boutiqueVisitImage { ${hotspotImageFields} }
}`;

export async function getHomePageContent(): Promise<HomePageContent | null> {
  return sanityClient.fetch<HomePageContent | null>(
    homePageQuery,
    {},
    sanityFetchOptions,
  );
}

export async function getJournalArticles(): Promise<JournalArticleListItem[]> {
  return sanityClient.fetch<JournalArticleListItem[]>(
    articlesQuery,
    {},
    sanityFetchOptions,
  );
}

export async function getJournalArticleBySlug(
  slug: string,
): Promise<JournalArticle | null> {
  return sanityClient.fetch<JournalArticle | null>(
    articleBySlugQuery,
    { slug },
    sanityFetchOptions,
  );
}

export async function getJournalArticleSlugs(): Promise<string[]> {
  const rows = await getJournalArticleSitemapEntries();
  return rows.map((row) => row.slug);
}

export async function getJournalArticleSitemapEntries(): Promise<
  { slug: string; _updatedAt: string }[]
> {
  const rows = await sanityClient.fetch<{ slug: string; _updatedAt: string }[]>(
    articleSlugsQuery,
    {},
    sanityFetchOptions,
  );

  return rows.filter((row) => Boolean(row.slug));
}
