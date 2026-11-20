"use client";

import ProductImageWishlist from "@/components/ProductImageWishlist";
import ProductPurchasePanel from "@/components/ProductPurchasePanel";
import ShopifyProductImage from "@/components/ShopifyProductImage";
import {
  getUniqueProductImageUrls,
  prefetchShopifyImages,
  SHOPIFY_IMAGE_WIDTH,
} from "@/lib/shopify/image";
import type { ShopifyProductDetail } from "@/lib/shopify/queries";
import {
  getInitialSelections,
  getProductImageForSelections,
  getSelectionsForChange,
} from "@/lib/shopify/variants";
import { useSearchParams } from "next/navigation";
import {
  Suspense,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const DETAIL_IMAGE_SIZES = "(max-width: 768px) 100vw, 50vw";

type ProductDetailClientProps = {
  product: ShopifyProductDetail;
  // Rendered above the purchase panel (the server-built breadcrumbs).
  breadcrumbs?: ReactNode;
};

/**
 * Reports `?couleur=` from the URL. Read in the browser, not by the server
 * page: a server read of searchParams renders every product view on demand
 * (billed Vercel CPU), while this keeps product pages prerendered and cached.
 * Inside <Suspense> so only this empty component skips the prerender.
 */
function RequestedColor({
  onChange,
}: {
  onChange: (color: string | undefined) => void;
}) {
  const color = useSearchParams().get("couleur") ?? undefined;
  useEffect(() => onChange(color), [color, onChange]);
  return null;
}

export default function ProductDetailClient({
  product,
  breadcrumbs,
}: ProductDetailClientProps) {
  const [requestedColor, setRequestedColor] = useState<string>();
  const [selections, setSelections] = useState(() =>
    getInitialSelections(product.options, product.variants, requestedColor),
  );

  // Reset the selected variant when the product or requested colour changes,
  // during render rather than in a sync effect.
  const selectionKey = `${product.id}|${requestedColor ?? ""}`;
  const [prevSelectionKey, setPrevSelectionKey] = useState(selectionKey);
  if (selectionKey !== prevSelectionKey) {
    setPrevSelectionKey(selectionKey);
    setSelections(
      getInitialSelections(product.options, product.variants, requestedColor),
    );
  }

  const displayImage = useMemo(
    () => getProductImageForSelections(product, selections),
    [product, selections],
  );

  useEffect(() => {
    prefetchShopifyImages(getUniqueProductImageUrls(product), DETAIL_IMAGE_SIZES);
  }, [product]);

  const handleSelectionChange = (optionName: string, value: string) => {
    setSelections((current) =>
      getSelectionsForChange(product.variants, current, optionName, value),
    );
  };

  return (
    <section className="flex min-h-svh flex-col overflow-x-hidden bg-white text-black md:flex-row">
      <Suspense fallback={null}>
        <RequestedColor onChange={setRequestedColor} />
      </Suspense>
      <ProductImageWishlist
        product={product}
        className="relative h-[55svh] w-full shrink-0 md:min-h-svh md:w-1/2 md:self-stretch"
        heartClassName="absolute top-4 right-4 z-10 md:top-8 md:right-8"
      >
        <ShopifyProductImage
          src={displayImage.imageUrl}
          alt={displayImage.imageAlt}
          preload
          padding="lg"
          width={SHOPIFY_IMAGE_WIDTH.detail}
          className="h-full w-full"
          sizes={DETAIL_IMAGE_SIZES}
        />
      </ProductImageWishlist>

      <div className="flex min-w-0 w-full flex-col justify-center overflow-x-hidden px-4 py-12 md:w-1/2 md:px-12 md:py-24 lg:px-20">
        {breadcrumbs}
        <ProductPurchasePanel
          product={product}
          selections={selections}
          onSelectionChange={handleSelectionChange}
        />
      </div>
    </section>
  );
}
