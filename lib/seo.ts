import type { Metadata } from "next";
import {
  DEFAULT_LOCALE,
  INTL_LOCALE,
  LIVE_LOCALES,
  OG_LOCALE,
  isLiveLocale,
  withLocale,
  type Locale,
} from "./i18n/config";
import { interpolate } from "./i18n/dictionaries";
import enShell from "./i18n/dictionaries/en/shell.json";
import frShell from "./i18n/dictionaries/fr/shell.json";
import nlShell from "./i18n/dictionaries/nl/shell.json";
import { siteConfig } from "./site";

type ShareImage = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};

type PageMetadataOptions = {
  locale: Locale;
  title?: string;
  description?: string;
  /** The route without its language, as in `routes`. */
  path?: string;
  /** Per-language paths, when they differ — see `languageAlternates`. */
  localizedPaths?: Partial<Record<Locale, string>>;
  // Falls back to the site-wide share image.
  image?: ShareImage;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
  };
};

type SiteCopy = (typeof frShell)["site"];

// Read synchronously, unlike getDictionary: metadata helpers aren't async.
// French fills any key a translation lacks.
const siteCopyByLocale: Record<Locale, SiteCopy> = {
  fr: frShell.site,
  nl: { ...frShell.site, ...nlShell.site },
  en: { ...frShell.site, ...enShell.site },
};

/** The site-wide description, default title and share image alt. */
export function siteCopy(locale: Locale): SiteCopy {
  return siteCopyByLocale[locale];
}

export function defaultPageTitle(locale: Locale) {
  return interpolate(siteCopy(locale).defaultTitle, { name: siteConfig.name });
}

// Shown when a page is shared on Facebook, WhatsApp, etc.
export function defaultShareImage(locale: Locale) {
  return {
    url: "/images/shared/partage-reseaux.jpg",
    width: 1200,
    height: 630,
    alt: siteCopy(locale).shareImageAlt,
  } satisfies ShareImage;
}

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

/**
 * Canonical and hreflang for one route in one language.
 *
 * A language that is not live yet still renders French copy, so its pages are
 * duplicates of the French ones: they canonicalise to French and are left out
 * of hreflang, which only lists translations that really exist.
 *
 * `localizedPaths` is for content whose path differs per language — a journal
 * article has its own slug in each translation, and may not exist in all of
 * them. A language missing from it has no version of the page.
 */
export function languageAlternates(
  path: string,
  locale: Locale,
  localizedPaths?: Partial<Record<Locale, string>>,
): NonNullable<Metadata["alternates"]> {
  const pathIn = (target: Locale) =>
    localizedPaths ? localizedPaths[target] : path;
  const own = withLocale(pathIn(locale) ?? path, locale);
  const frenchPath = pathIn(DEFAULT_LOCALE);
  const canonical =
    isLiveLocale(locale) || !frenchPath
      ? own
      : withLocale(frenchPath, DEFAULT_LOCALE);

  const translations = LIVE_LOCALES.flatMap((live) => {
    const translated = pathIn(live);
    return translated ? [[live, withLocale(translated, live)] as const] : [];
  });

  if (translations.length < 2) return { canonical };

  return {
    canonical,
    languages: {
      ...Object.fromEntries(
        translations.map(([live, url]) => [INTL_LOCALE[live], url]),
      ),
      ...(frenchPath
        ? { "x-default": withLocale(frenchPath, DEFAULT_LOCALE) }
        : {}),
    },
  };
}

/** Untranslated languages stay out of the index until they are live. */
export function localeRobots(locale: Locale): Metadata["robots"] {
  return isLiveLocale(locale)
    ? { index: true, follow: true }
    : { index: false, follow: true };
}

export function createPageMetadata({
  locale,
  title,
  description = siteCopy(locale).description,
  path = "/",
  localizedPaths,
  image = defaultShareImage(locale),
  article,
}: PageMetadataOptions): Metadata {
  const barePath = path.startsWith("/") ? path : `/${path}`;
  const pageTitle = title ?? siteConfig.name;
  const resolvedTitle = title
    ? pageTitle
    : barePath === "/"
      ? { absolute: defaultPageTitle(locale) }
      : undefined;
  const shareTitle = title
    ? `${title} | ${siteConfig.name}`
    : defaultPageTitle(locale);
  const url = `${siteConfig.url}${withLocale(barePath, locale)}`;

  return {
    ...(resolvedTitle ? { title: resolvedTitle } : {}),
    description,
    alternates: languageAlternates(barePath, locale, localizedPaths),
    robots: localeRobots(locale),
    openGraph: {
      locale: OG_LOCALE[locale],
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

export function rootMetadata(locale: Locale): Metadata {
  const title = defaultPageTitle(locale);
  const { description } = siteCopy(locale);
  const image = defaultShareImage(locale);

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: title,
      template: `%s | ${siteConfig.name}`,
    },
    description,
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale],
      siteName: siteConfig.name,
      title,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: localeRobots(locale),
  };
}
