import { withLocale, type Locale } from "@/lib/i18n/config";
import { routes } from "@/lib/routes";
import { getUniqueProductImageUrls } from "@/lib/shopify/image";
import type { ShopifyProductDetail } from "@/lib/shopify/queries";
import { isColorOption } from "@/lib/shopify/variants";
import { siteConfig } from "@/lib/site";

// Price, availability and photos for search results and Google Shopping's
// free listings: one offer per variant, each linking to its colour.
export default function ProductJsonLd({
  product,
  locale,
}: {
  product: ShopifyProductDetail;
  locale: Locale;
}) {
  const offers = product.variants
    .filter((variant) => variant.amount && variant.currencyCode)
    .map((variant) => {
      const color = variant.selectedOptions.find((option) =>
        isColorOption(option.name),
      )?.value;

      return {
        "@type": "Offer",
        name: variant.selectedOptions.map(({ value }) => value).join(" / "),
        price: variant.amount,
        priceCurrency: variant.currencyCode,
        availability: variant.availableForSale
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        itemCondition: "https://schema.org/NewCondition",
        url: `${siteConfig.url}${withLocale(
          routes.product(product.handle, { color }),
          locale,
        )}`,
        seller: { "@id": `${siteConfig.url}/#boutique` },
      };
    });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.seoDescription ?? product.description,
    image: getUniqueProductImageUrls(product),
    brand: { "@type": "Brand", name: siteConfig.name },
    url: `${siteConfig.url}${withLocale(routes.product(product.handle), locale)}`,
    ...(offers.length > 0 ? { offers } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
