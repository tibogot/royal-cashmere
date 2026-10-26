import Breadcrumbs from "@/components/Breadcrumbs";
import ProductDetailClient from "@/components/ProductDetailClient";
import { getPrimaryCatalogCollection } from "@/lib/catalog";
import { routes } from "@/lib/routes";
import type { ShopifyProductDetail } from "@/lib/shopify/queries";

type ProductDetailViewProps = {
  product: ShopifyProductDetail;
  initialColor?: string;
};

export default function ProductDetailView({
  product,
  initialColor,
}: ProductDetailViewProps) {
  // Products outside the category tree lead back to the whole shop.
  const primary = getPrimaryCatalogCollection(product);
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
    : [{ label: "Boutique", href: routes.shop }];

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
