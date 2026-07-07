export const siteConfig = {
  name: "Royal Cashmere",
  url: "https://www.royal-cashmere.eu",
  defaultLocale: "fr",
  locales: ["fr", "nl", "en"] as const,
  description:
    "Boutique de cachemire d'exception à Uccle, Bruxelles. Pulls, écharpes et accessoires en pur cachemire de Mongolie.",
  contact: {
    street: "Chaussée de Waterloo 1251B",
    postalCode: "1180",
    city: "Uccle",
    region: "Bruxelles",
    country: "Belgique",
    phone: "+32 2 850 59 44",
    email: "contact@royal-cashmere.eu",
  },
  legal: {
    companyName: "Royal Cashmere",
    /** Numéro d'entreprise BCE (10 chiffres) — obligatoire sur les mentions légales */
    enterpriseNumber: "",
    /** Numéro de TVA belge (ex. BE0123456789) */
    vatNumber: "",
    /** Forme juridique (ex. « Entreprise individuelle », « SRL ») */
    legalForm: "",
    hosting: {
      provider: "Vercel Inc.",
      address: "440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis",
      website: "https://vercel.com",
    },
    mediation: {
      name: "Service de Médiation pour le Consommateur",
      website: "https://www.mediationconsommateur.be",
      email: "info@mediationconsommateur.be",
    },
    dataProtectionAuthority: {
      name: "Autorité de protection des données (APD)",
      website: "https://www.autoriteprotectiondonnees.be",
    },
  },
  social: {
    facebook: "https://www.facebook.com/RoyalCashmere.be/",
  },
} as const;

export type SiteLocale = (typeof siteConfig.locales)[number];
