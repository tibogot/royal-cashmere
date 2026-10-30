"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import { withLocale, type Locale } from "@/lib/i18n/config";
import { useLocale } from "@/components/LocaleProvider";

/**
 * `next/link` with the current language on the front of the href. Imported as
 * `Link` at call sites. The proxy would prefix bare hrefs anyway, but only by
 * redirecting on every navigation.
 *
 * `/api/*` has no language and would 404 with one; anchors and absolute URLs
 * are left alone.
 */
type LocaleLinkProps = ComponentProps<typeof NextLink> & {
  /**
   * Links into another language than the page's — a French article listed on
   * the Dutch journal while it has no Dutch translation.
   */
  locale?: Locale;
};

export function isLocalisableHref(href: unknown): href is string {
  return (
    typeof href === "string" &&
    href.startsWith("/") &&
    !href.startsWith("//") &&
    !href.startsWith("/api/")
  );
}

export function LocaleLink({ href, locale: target, ...props }: LocaleLinkProps) {
  const current = useLocale();
  const locale = target ?? current;

  return (
    <NextLink
      href={isLocalisableHref(href) ? withLocale(href, locale) : href}
      {...(locale !== current ? { hrefLang: locale } : {})}
      {...props}
    />
  );
}

export default LocaleLink;
