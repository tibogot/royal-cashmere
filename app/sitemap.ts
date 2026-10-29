import type { MetadataRoute } from "next";
import { routes } from "@/lib/routes";
import { getJournalArticleSitemapEntries } from "@/lib/sanity/queries";
import { getListedCollectionHandles } from "@/lib/shopify/collections";
import { getAllProducts } from "@/lib/shopify/products";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, products, collectionHandles] = await Promise.all([
    getJournalArticleSitemapEntries(),
    getAllProducts(),
    getListedCollectionHandles(),
  ]);

  // No lastModified unless we know the real date: stamping every URL with
  // "now" on each build teaches Google to ignore the field site-wide.
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}${routes.shop}`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}${routes.about}`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}${routes.journal}`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}${routes.contact}`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteConfig.url}${routes.product(product.handle)}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const collectionEntries: MetadataRoute.Sitemap = collectionHandles.map(
    (handle) => ({
      url: `${siteConfig.url}${routes.collectionByHandle(handle)}`,
      changeFrequency: "weekly",
      priority: 0.7,
    }),
  );

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${siteConfig.url}${routes.journalArticle(article.slug)}`,
    lastModified: article._updatedAt,
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
