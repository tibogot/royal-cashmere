import { defaultShareImage } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export default function OrganizationJsonLd() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ClothingStore",
      "@id": `${siteConfig.url}/#boutique`,
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
      image: `${siteConfig.url}${defaultShareImage.url}`,
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
      inLanguage: "fr-BE",
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
