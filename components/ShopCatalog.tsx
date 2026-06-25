"use client";

import ProductCard from "@/components/ProductCard";
import {
  boutiqueFilters,
  filterProducts,
} from "@/lib/boutique-filters";
import type { ShopifyProduct } from "@/lib/shopify/queries";
import { useMemo, useState } from "react";

type ShopCatalogProps = {
  products: ShopifyProduct[];
};

export default function ShopCatalog({ products }: ShopCatalogProps) {
  const [activeFilterId, setActiveFilterId] = useState("all");

  const filteredProducts = useMemo(
    () => filterProducts(products, activeFilterId),
    [products, activeFilterId],
  );

  return (
    <>
      <div className="mt-10 flex flex-col gap-6 border-b border-black/10 pb-6 md:mt-12 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {boutiqueFilters.map((filter) => {
            const isActive = filter.id === activeFilterId;

            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveFilterId(filter.id)}
                aria-pressed={isActive}
                className={`select-none text-sm uppercase tracking-wide transition-opacity ${
                  isActive
                    ? "text-black"
                    : "text-black/50 hover:text-black/80"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <p className="text-sm text-black/50">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "produit" : "produits"}
        </p>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 md:mt-12 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              layout="grid"
            />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-sm text-black/60">
          Aucun produit ne correspond à cette catégorie pour le moment.
        </p>
      )}
    </>
  );
}
