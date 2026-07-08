import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true,
  },
  images: {
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
