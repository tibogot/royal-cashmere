import type { Locale } from "@/lib/i18n/config";
import { siteConfig } from "@/lib/site";

/** When the legal texts last changed, shown dated in each page's language. */
export const legalLastUpdated = "2026-07-07";

export function formatEnterpriseNumber(number: string) {
  const digits = number.replace(/\D/g, "");
  if (digits.length !== 10) return number;
  return `${digits.slice(0, 4)}.${digits.slice(4, 7)}.${digits.slice(7)}`;
}

/**
 * The registered address as each language writes it. Brussels is officially
 * bilingual, so the Dutch street and municipality names are the legal ones in
 * a Dutch text, not a translation; English uses the French names, as the
 * address appears on the shopfront.
 */
const ADDRESS: Record<Locale, { street: string; city: string; country: string }> = {
  fr: { street: siteConfig.contact.street, city: siteConfig.contact.city, country: "Belgique" },
  nl: { street: "Waterloosesteenweg 1251B", city: "Ukkel", country: "België" },
  en: { street: siteConfig.contact.street, city: siteConfig.contact.city, country: "Belgium" },
};

export function getCompanyAddress(locale: Locale) {
  const { street, city, country } = ADDRESS[locale];
  return `${street}, ${siteConfig.contact.postalCode} ${city}, ${country}`;
}

export function getRegisteredOfficeAddress(locale: Locale) {
  return getCompanyAddress(locale);
}

export function getLegalIdentifiers() {
  const { enterpriseNumber, vatNumber, legalForm } = siteConfig.legal;

  return {
    enterpriseNumber: enterpriseNumber.trim() || null,
    vatNumber: vatNumber.trim() || null,
    legalForm: legalForm.trim() || null,
  };
}
