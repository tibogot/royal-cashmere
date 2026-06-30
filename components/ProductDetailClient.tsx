"use client";

import ProductPurchasePanel from "@/components/ProductPurchasePanel";
import type { ShopifyProductDetail } from "@/lib/shopify/queries";
import {
  getDefaultSelections,
  getProductImageForSelections,
} from "@/lib/shopify/variants";
import Image from "next/image";
import { useMemo, useState } from "react";

type ProductDetailClientProps = {
  product: ShopifyProductDetail;
};

export default function ProductDetailClient({
  product,
}: ProductDetailClientProps) {
  const [selections, setSelections] = useState(() =>
    getDefaultSelections(product.options, product.variants),
  );

  const displayImage = useMemo(
    () => getProductImageForSelections(product, selections),
    [product, selections],
  );

  const handleSelectionChange = (optionName: string, value: string) => {
    setSelections((current) => ({
      ...current,
      [optionName]: value,
    }));
  };

  return (
    <section className="flex min-h-svh flex-col overflow-x-hidden bg-white text-black md:flex-row">
      <div className="relative h-[55svh] w-full shrink-0 md:h-auto md:min-h-svh md:w-1/2">
        <Image
          key={displayImage.imageUrl}
          src={displayImage.imageUrl}
          alt={displayImage.imageAlt}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

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
