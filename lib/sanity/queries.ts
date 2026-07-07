import { sanityClient, sanityFetchOptions } from "./client";
import type { JournalArticle, JournalArticleListItem } from "./types";

const articleListFields = `
  _id,
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
  "slug": slug.current
}`;

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
  const rows = await sanityClient.fetch<{ slug: string }[]>(
    articleSlugsQuery,
    {},
    sanityFetchOptions,
  );

  return rows.map((row) => row.slug).filter(Boolean);
}
