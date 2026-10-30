import Breadcrumbs from "@/components/Breadcrumbs";
import ProductDetailClient from "@/components/ProductDetailClient";
import { getPrimaryCatalogCollection, type CatalogCopy } from "@/lib/catalog";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { routes } from "@/lib/routes";
import type { ShopifyProductDetail } from "@/lib/shopify/queries";

type ProductDetailViewProps = {
  product: ShopifyProductDetail;
  initialColor?: string;
  copy: CatalogCopy & Pick<Dictionary, "product">;
};

export default function ProductDetailView({
  product,
  initialColor,
  copy,
}: ProductDetailViewProps) {
  // Products outside the category tree lead back to the whole shop.
  const primary = getPrimaryCatalogCollection(product, copy);
  const parents = primary
    ? [
        {
          label: primary.section.label,
          href: routes.collectionByHandle(primary.section.handle),
        },
        {
          label: primary.collection.label,
          href: routes.collectionByHandle(primary.collection.handle),
        },
      ]
    : [{ label: copy.product.breadcrumbShop, href: routes.shop }];

  return (
    <ProductDetailClient
      product={product}
      initialColor={initialColor}
      breadcrumbs={
        <Breadcrumbs
          items={[
            ...parents,
            { label: product.title, href: routes.product(product.handle) },
          ]}
          className="mb-6"
        />
      }
    />
  );
}
