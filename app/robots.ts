import type { MetadataRoute } from "next";
import { LOCALES } from "@/lib/i18n/config";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Utility / user-specific pages that shouldn't be indexed.
      disallow: [
        ...LOCALES.flatMap((locale) =>
          [routes.cart, routes.wishlist, routes.account, routes.signIn].map(
            (route) => `/${locale}${route}`,
          ),
        ),
        "/api/",
      ],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
