import type { MetadataRoute } from "next";
import { routes } from "@/lib/routes";
import { getJournalArticleSlugs } from "@/lib/sanity/queries";
import { getCollections } from "@/lib/shopify/collections";
import { getAllProducts } from "@/lib/shopify/products";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articleSlugs, products, collections] = await Promise.all([
    getJournalArticleSlugs(),
    getAllProducts(),
    getCollections(),
  ]);

  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}${routes.shop}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}${routes.about}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}${routes.journal}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}${routes.contact}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteConfig.url}${routes.product(product.handle)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const collectionEntries: MetadataRoute.Sitemap = collections.map(
    (collection) => ({
      url: `${siteConfig.url}${routes.collectionByHandle(collection.handle)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    }),
  );

  const articleEntries: MetadataRoute.Sitemap = articleSlugs.map((slug) => ({
    url: `${siteConfig.url}${routes.journalArticle(slug)}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...staticEntries,
    ...collectionEntries,
    ...productEntries,
    ...articleEntries,
  ];
}
