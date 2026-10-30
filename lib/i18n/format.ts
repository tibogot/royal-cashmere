/**
 * Dates and money in the language the page is read in. The locale is always
 * passed in rather than read from somewhere ambient, so these stay pure.
 */

import { INTL_LOCALE, type Locale } from "./config";

/** "12 mars 2026" / "12 maart 2026" / "12 March 2026". */
export function formatLongDate(locale: Locale, value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatMoney(
  locale: Locale,
  amount: number | string,
  currencyCode = "EUR",
) {
  const value = typeof amount === "string" ? Number(amount) : amount;
  if (!Number.isFinite(value)) return "";

  return new Intl.NumberFormat(INTL_LOCALE[locale], {
    style: "currency",
    currency: currencyCode,
  }).format(value);
}
