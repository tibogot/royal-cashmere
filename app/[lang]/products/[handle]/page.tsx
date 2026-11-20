import ProductDetailView from "@/components/ProductDetailView";
import ProductJsonLd from "@/components/ProductJsonLd";
import RecentlyViewedProducts from "@/components/RecentlyViewedProducts";
import SimilarProducts from "@/components/SimilarProducts";
import { toLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { routes } from "@/lib/routes";
import { createPageMetadata, toMetaDescription } from "@/lib/seo";
import { getProductByHandle } from "@/lib/shopify/products";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type ProductPageProps = {
  params: Promise<{ lang: string; handle: string }>;
};

/**
 * No product is built at deploy time: each one renders on its first visit and
 * is then served from the cache (refreshed hourly, like the Shopify fetches).
 * Without this, the route is rendered on every request.
 */
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { lang, handle } = await params;
  const locale = toLocale(lang);
  const product = await getProductByHandle(handle, locale);

  if (!product) {
    const dict = await getDictionary(locale);
    return createPageMetadata({ locale, title: dict.product.notFoundTitle });
  }

  return createPageMetadata({
    locale,
    title: product.seoTitle ?? product.title,
    description: toMetaDescription(
      product.seoDescription ?? product.description,
    ),
    path: routes.product(handle),
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { lang, handle } = await params;
  const locale = toLocale(lang);
  const [product, dict] = await Promise.all([
    getProductByHandle(handle, locale),
    getDictionary(locale),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <main className="w-full overflow-x-hidden pt-24 md:pt-0">
      <ProductJsonLd product={product} locale={locale} />
      <ProductDetailView
        product={product}
        copy={dict}
      />
      <SimilarProducts
        product={product}
        locale={locale}
        title={dict.product.similarTitle}
      />
      <RecentlyViewedProducts currentHandle={product.handle} />
    </main>
  );
}
