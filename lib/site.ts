export const siteConfig = {
  name: "Royal Cashmere",
  url: "https://www.royal-cashmere.eu",
  defaultLocale: "fr",
  locales: ["fr", "nl", "en"] as const,
  description:
    "Boutique de cachemire d'exception à Uccle, Bruxelles. Pulls, écharpes et accessoires en pur cachemire de Mongolie.",
  contact: {
    street: "Chaussée de Waterloo 1251B",
    city: "Uccle",
    region: "Bruxelles",
    country: "Belgique",
    phone: "+32 2 850 59 44",
  },
} as const;

export type SiteLocale = (typeof siteConfig.locales)[number];
