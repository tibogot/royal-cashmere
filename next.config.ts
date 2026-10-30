import type { NextConfig } from "next";
// Relative import: the config loader doesn't resolve the "@/" alias, so this
// can't go through lib/routes.
import {
  ALL_PRODUCTS_HANDLE,
  legacyCollectionRedirects,
} from "./lib/collection-handles";

const shopPath = `/collection/${ALL_PRODUCTS_HANDLE}`;

// Mirrors LOCALES in lib/i18n/config. These run before proxy.ts, so the
// unprefixed sources go straight to French instead of hopping through it.
const LANG = ":lang(fr|nl|en)";

const nextConfig: NextConfig = {
  // The shop and the collections index used to be separate pages; every
  // listing is now a collection, with the shop at /collection/tout.
  async redirects() {
    const moves: [string, string][] = [
      ["/boutique", shopPath],
      ["/collection", shopPath],
      ...Object.entries(legacyCollectionRedirects).map(
        ([oldHandle, newHandle]): [string, string] => [
          `/collection/${oldHandle}`,
          `/collection/${newHandle}`,
        ],
      ),
    ];

    return moves.flatMap(([source, destination]) => [
      { source, destination: `/fr${destination}`, permanent: true },
      {
        source: `/${LANG}${source}`,
        destination: `/:lang${destination}`,
        permanent: true,
      },
    ]);
  },
  experimental: {
    inlineCss: true,
  },
  images: {
    // AVIF is ~20% smaller than WebP; browsers without it get WebP.
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
