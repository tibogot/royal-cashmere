import ProductDetailView from "@/components/ProductDetailView";
import { createPageMetadata } from "@/lib/seo";
import { getProductByHandle } from "@/lib/shopify/products";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type ProductPageProps = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    return createPageMetadata({ title: "Produit introuvable" });
  }

  return createPageMetadata({
    title: product.title,
    description: product.description.slice(0, 160),
    path: `/products/${handle}`,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  return (
    <main className="w-full overflow-x-hidden pt-24 md:pt-0">
      <ProductDetailView product={product} />
    </main>
  );
}
