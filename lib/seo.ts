import type { Metadata } from "next";
import { siteConfig } from "./site";

type PageMetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
};

export function createPageMetadata({
  title,
  description = siteConfig.description,
  path = "",
}: PageMetadataOptions = {}): Metadata {
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const pageTitle = title ?? siteConfig.name;

  return {
    title: title ? pageTitle : undefined,
    description,
    alternates: {
      canonical: canonicalPath === "/" ? "/" : canonicalPath,
    },
    openGraph: {
      type: "website",
      locale: "fr_BE",
      url: `${siteConfig.url}${canonicalPath === "/" ? "" : canonicalPath}`,
      siteName: siteConfig.name,
      title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
      description,
    },
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Cachemire d'exception à Uccle, Bruxelles`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "fr_BE",
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Cachemire d'exception à Uccle, Bruxelles`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Cachemire d'exception à Uccle, Bruxelles`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};
