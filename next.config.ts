import type { NextConfig } from "next";
// Relative import: the config loader doesn't resolve the "@/" alias, so this
// can't go through lib/routes.
import {
  ALL_PRODUCTS_HANDLE,
  legacyCollectionRedirects,
} from "./lib/collection-handles";

const shopPath = `/collection/${ALL_PRODUCTS_HANDLE}`;

const nextConfig: NextConfig = {
  // The shop and the collections index used to be separate pages; every
  // listing is now a collection, with the shop at /collection/tout.
  async redirects() {
    return [
      { source: "/boutique", destination: shopPath, permanent: true },
      { source: "/collection", destination: shopPath, permanent: true },
      ...Object.entries(legacyCollectionRedirects).map(
        ([oldHandle, newHandle]) => ({
          source: `/collection/${oldHandle}`,
          destination: `/collection/${newHandle}`,
          permanent: true,
        }),
      ),
    ];
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
