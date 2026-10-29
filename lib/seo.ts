import type { Metadata } from "next";
import { siteConfig } from "./site";

type ShareImage = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};

type PageMetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
  // Falls back to the site-wide share image.
  image?: ShareImage;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
  };
};

export const defaultPageTitle = `${siteConfig.name} | Cachemire d'exception à Uccle, Bruxelles`;

// Shown when a page is shared on Facebook, WhatsApp, etc.
export const defaultShareImage = {
  url: "/images/shared/partage-reseaux.jpg",
  width: 1200,
  height: 630,
  alt: "Cavalière en manteau de cachemire dans la steppe mongole",
} as const satisfies ShareImage;

const META_DESCRIPTION_MAX = 160;

/**
 * Trims text to a meta description length on a word boundary, so Google
 * never shows a word cut in half.
 */
export function toMetaDescription(
  text: string | undefined,
  max = META_DESCRIPTION_MAX,
): string | undefined {
  const clean = text?.replace(/\s+/g, " ").trim();
  if (!clean) return undefined;
  if (clean.length <= max) return clean;

  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.–—-]+$/, "")}…`;
}

export function createPageMetadata({
  title,
  description = siteConfig.description,
  path = "",
  image = defaultShareImage,
  article,
}: PageMetadataOptions = {}): Metadata {
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const pageTitle = title ?? siteConfig.name;
  const resolvedTitle = title
    ? pageTitle
    : canonicalPath === "/"
      ? { absolute: defaultPageTitle }
      : undefined;
  const shareTitle = title ? `${title} | ${siteConfig.name}` : defaultPageTitle;
  const url = `${siteConfig.url}${canonicalPath === "/" ? "" : canonicalPath}`;

  return {
    ...(resolvedTitle ? { title: resolvedTitle } : {}),
    description,
    alternates: {
      canonical: canonicalPath === "/" ? "/" : canonicalPath,
    },
    openGraph: {
      locale: "fr_BE",
      url,
      siteName: siteConfig.name,
      title: shareTitle,
      description,
      images: [image],
      ...(article
        ? { type: "article", ...article }
        : { type: "website" }),
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: [image],
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
    images: [defaultShareImage],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultPageTitle,
    description: siteConfig.description,
    images: [defaultShareImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};
