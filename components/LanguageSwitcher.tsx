"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useDictionary, useLocale } from "@/components/LocaleProvider";
import {
  LIVE_LOCALES,
  LOCALE_NAME,
  withLocale,
} from "@/lib/i18n/config";
import { rememberLocale } from "@/lib/i18n/remember-locale";

type LanguageSwitcherProps = {
  className?: string;
  linkClassName?: string;
  /**
   * Marks the links for the navbar's colour tweens (`[data-nav-link]`), so
   * they turn white over the hero like the links beside them.
   */
  navLink?: boolean;
};

/**
 * The same page in each live language. Renders nothing while French is the
 * only one, so a half-translated language is never offered to visitors.
 *
 * Plain `next/link` rather than `LocaleLink`, which would put the *current*
 * language back on the front of the href.
 */
export default function LanguageSwitcher({
  className = "",
  linkClassName = "",
  navLink = false,
}: LanguageSwitcherProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const { languageSwitcher } = useDictionary();

  if (LIVE_LOCALES.length < 2) return null;

  return (
    <nav aria-label={languageSwitcher.ariaLabel} className={`flex items-center gap-3 ${className}`}>
      {LIVE_LOCALES.map((target) => (
        <NextLink
          key={target}
          href={withLocale(pathname, target)}
          hrefLang={target}
          lang={target}
          aria-current={target === locale ? "true" : undefined}
          onClick={() => rememberLocale(target)}
          data-nav-link={navLink ? true : undefined}
          className={`uppercase ${target === locale ? "" : "opacity-65"} ${linkClassName}`}
        >
          <span aria-hidden="true">{target}</span>
          <span className="sr-only">{LOCALE_NAME[target]}</span>
        </NextLink>
      ))}
    </nav>
  );
}
