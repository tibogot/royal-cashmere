"use client";

import { createContext, Fragment, useContext } from "react";
import { usePathname } from "next/navigation";
import { DEFAULT_LOCALE, stripLocale, type Locale } from "@/lib/i18n/config";
import type { ClientDictionary } from "@/lib/i18n/dictionaries";

/**
 * The active language and its client-side copy, for components deep in the
 * tree that cannot read the `lang` param. Reading the locale from a proxy
 * header instead would make every page dynamic and cost the site its static
 * prerendering; a client Provider in the root layout still reaches
 * server-rendered children during SSR.
 *
 * Server Components take their copy from `getDictionary` (or as a prop from
 * the page that loaded it) — context is a client-only mechanism.
 */
type LocaleContextValue = {
  locale: Locale;
  dictionary: ClientDictionary;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  dictionary,
  children,
}: {
  locale: Locale;
  /** The trimmed dictionary — see CLIENT_SECTIONS in lib/i18n/dictionaries.ts. */
  dictionary: ClientDictionary;
  children: React.ReactNode;
}) {
  // Keyed by language: switching language remounts the tree, so the shared
  // stores (cart, menus, product lists) resubscribe and refetch in the new
  // language instead of keeping what they loaded in the old one. `<html lang>`
  // is already updated when their effects run — see lib/i18n/document-locale.
  return (
    <LocaleContext.Provider value={{ locale, dictionary }}>
      <Fragment key={locale}>{children}</Fragment>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext)?.locale ?? DEFAULT_LOCALE;
}

/**
 * The current route without its language, for comparing against `routes`.
 * `usePathname()` now returns "/fr", never "/", so a bare
 * `pathname === routes.home` would silently stop matching.
 */
export function useBarePathname() {
  return stripLocale(usePathname());
}

/**
 * Throws rather than falling back when the Provider is missing: a silent
 * fallback would look like a translation gap rather than the wiring mistake
 * it is.
 */
export function useDictionary(): ClientDictionary {
  const value = useContext(LocaleContext);
  if (!value) {
    throw new Error("useDictionary must be used inside <LocaleProvider>.");
  }

  return value.dictionary;
}
