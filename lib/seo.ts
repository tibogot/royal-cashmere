import type { Metadata } from "next";
import { siteConfig } from "./site";

type PageMetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
};

export const defaultPageTitle = `${siteConfig.name} | Cachemire d'exception à Uccle, Bruxelles`;

export function createPageMetadata({
  title,
  description = siteConfig.description,
  path = "",
}: PageMetadataOptions = {}): Metadata {
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const pageTitle = title ?? siteConfig.name;
  const resolvedTitle = title
    ? pageTitle
    : canonicalPath === "/"
      ? { absolute: defaultPageTitle }
      : undefined;

  return {
    ...(resolvedTitle ? { title: resolvedTitle } : {}),
    description,
    alternates: {
      canonical: canonicalPath === "/" ? "/" : canonicalPath,
    },
    openGraph: {
      type: "website",
      locale: "fr_BE",
      url: `${siteConfig.url}${canonicalPath === "/" ? "" : canonicalPath}`,
      siteName: siteConfig.name,
      title: title ? `${title} | ${siteConfig.name}` : defaultPageTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: title ? `${title} | ${siteConfig.name}` : defaultPageTitle,
      description,
    },
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: defaultPageTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "fr_BE",
    siteName: siteConfig.name,
    title: defaultPageTitle,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultPageTitle,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};
