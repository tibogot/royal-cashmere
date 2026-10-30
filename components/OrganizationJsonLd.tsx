import { INTL_LOCALE, type Locale } from "@/lib/i18n/config";
import { defaultShareImage, siteCopy } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export default function OrganizationJsonLd({ locale }: { locale: Locale }) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ClothingStore",
      "@id": `${siteConfig.url}/#boutique`,
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteCopy(locale).description,
      image: `${siteConfig.url}${defaultShareImage(locale).url}`,
      telephone: siteConfig.contact.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: siteConfig.contact.street,
        postalCode: siteConfig.contact.postalCode,
        addressLocality: siteConfig.contact.city,
        addressRegion: siteConfig.contact.region,
        // schema.org expects the ISO 3166-1 code, not the country name.
        addressCountry: "BE",
      },
      sameAs: [siteConfig.social.facebook],
    },
    // Lets Google show "Royal Cashmere" as the site name in results instead
    // of the bare domain.
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#site`,
      name: siteConfig.name,
      url: siteConfig.url,
      inLanguage: INTL_LOCALE[locale],
      publisher: { "@id": `${siteConfig.url}/#boutique` },
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
