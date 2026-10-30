import type { MetadataRoute } from "next";
import {
  DEFAULT_LOCALE,
  INTL_LOCALE,
  LIVE_LOCALES,
  isLiveLocale,
  withLocale,
  type Locale,
} from "@/lib/i18n/config";
import { routes } from "@/lib/routes";
import {
  articleSlugsByLocale,
  getJournalArticleSitemapEntries,
} from "@/lib/sanity/queries";
import { getListedCollectionHandles } from "@/lib/shopify/collections";
import { getAllProducts } from "@/lib/shopify/products";
import { siteConfig } from "@/lib/site";

type Entry = Omit<MetadataRoute.Sitemap[number], "url"> & {
  /** The route without its language. */
  path: string;
};

/**
 * One URL per live language, each listing its translations so Google treats
 * them as the same page rather than duplicates. Languages that are not live
 * yet are left out entirely — see LIVE_LOCALES.
 */
function localise({ path, ...entry }: Entry): MetadataRoute.Sitemap {
  const languages =
    LIVE_LOCALES.length > 1
      ? {
          ...Object.fromEntries(
            LIVE_LOCALES.map((locale) => [
              INTL_LOCALE[locale],
              `${siteConfig.url}${withLocale(path, locale)}`,
            ]),
          ),
          "x-default": `${siteConfig.url}${withLocale(path, DEFAULT_LOCALE)}`,
        }
      : undefined;

  return LIVE_LOCALES.map((locale) => ({
    ...entry,
    url: `${siteConfig.url}${withLocale(path, locale)}`,
    ...(languages ? { alternates: { languages } } : {}),
  }));
}

/**
 * A journal article exists in one language per document, each with its own
 * slug, so it is listed once — in its own language, if that language is live —
 * with whichever of its translations are live as alternates.
 */
function localiseArticle(
  article: Awaited<ReturnType<typeof getJournalArticleSitemapEntries>>[number],
): MetadataRoute.Sitemap {
  if (!isLiveLocale(article.language)) return [];

  const urlIn = (locale: Locale, slug: string) =>
    `${siteConfig.url}${withLocale(routes.journalArticle(slug), locale)}`;
  const live = Object.entries(articleSlugsByLocale(article)).filter(
    ([locale]) => isLiveLocale(locale as Locale),
  ) as [Locale, string][];

  return [
    {
      url: urlIn(article.language, article.slug),
      lastModified: article._updatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
      ...(live.length > 1
        ? {
            alternates: {
              languages: Object.fromEntries(
                live.map(([locale, slug]) => [
                  INTL_LOCALE[locale],
                  urlIn(locale, slug),
                ]),
              ),
            },
          }
        : {}),
    },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, products, collectionHandles] = await Promise.all([
    getJournalArticleSitemapEntries(),
    getAllProducts(),
    getListedCollectionHandles(),
  ]);

  // No lastModified unless we know the real date: stamping every URL with
  // "now" on each build teaches Google to ignore the field site-wide.
  const staticEntries: Entry[] = [
    {
      path: routes.home,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      path: routes.shop,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      path: routes.about,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      path: routes.journal,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      path: routes.contact,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const productEntries: Entry[] = products.map((product) => ({
    path: routes.product(product.handle),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const collectionEntries: Entry[] = collectionHandles.map(
    (handle) => ({
      path: routes.collectionByHandle(handle),
      changeFrequency: "weekly",
      priority: 0.7,
    }),
  );

  return [
    ...[...staticEntries, ...collectionEntries, ...productEntries].flatMap(
      localise,
    ),
    ...articles.flatMap(localiseArticle),
  ];
}
