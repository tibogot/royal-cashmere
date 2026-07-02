"use client";

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
} from "@/lib/shopify/variants";
import { useEffect, useMemo, useState } from "react";

type ProductDetailClientProps = {
  product: ShopifyProductDetail;
  initialColor?: string;
};

export default function ProductDetailClient({
  product,
  initialColor,
}: ProductDetailClientProps) {
  const [selections, setSelections] = useState(() =>
    getInitialSelections(product.options, product.variants, initialColor),
  );

  useEffect(() => {
    setSelections(
      getInitialSelections(product.options, product.variants, initialColor),
    );
  }, [product, initialColor]);

  const displayImage = useMemo(
    () => getProductImageForSelections(product, selections),
    [product, selections],
  );

  useEffect(() => {
    prefetchShopifyImages(
      getUniqueProductImageUrls(product),
      SHOPIFY_IMAGE_WIDTH.detail,
    );
  }, [product]);

  const handleSelectionChange = (optionName: string, value: string) => {
    setSelections((current) => ({
      ...current,
      [optionName]: value,
    }));
  };

  return (
    <section className="flex min-h-svh flex-col overflow-x-hidden bg-white text-black md:flex-row">
      <ShopifyProductImage
        src={displayImage.imageUrl}
        alt={displayImage.imageAlt}
        priority
        padding="lg"
        width={SHOPIFY_IMAGE_WIDTH.detail}
        className="h-[55svh] w-full shrink-0 md:min-h-svh md:w-1/2 md:self-stretch"
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      <div className="flex min-w-0 w-full flex-col justify-center overflow-x-hidden px-4 py-12 md:w-1/2 md:px-12 md:py-24 lg:px-20">
        <ProductPurchasePanel
          product={product}
          selections={selections}
          onSelectionChange={handleSelectionChange}
        />
      </div>
    </section>
  );
}
