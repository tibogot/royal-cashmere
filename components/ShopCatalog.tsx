"use client";

import ProductCard from "@/components/ProductCard";
import {
  boutiqueFilters,
  filterProducts,
  searchProducts,
} from "@/lib/boutique-filters";
import type { ShopifyProduct } from "@/lib/shopify/queries";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type ShopCatalogProps = {
  products: ShopifyProduct[];
  initialFilterId?: string;
};

export default function ShopCatalog({
  products,
  initialFilterId = "all",
}: ShopCatalogProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const [activeFilterId, setActiveFilterId] = useState(initialFilterId);

  useEffect(() => {
    setActiveFilterId(initialFilterId);
  }, [initialFilterId]);

  const filteredProducts = useMemo(() => {
    const categoryProducts = filterProducts(products, activeFilterId);
    return searchProducts(categoryProducts, query);
  }, [products, activeFilterId, query]);

  return (
    <>
      {query ? (
        <p className="mt-10 text-center text-sm text-black/60 md:mt-12">
          Résultats pour &ldquo;{query}&rdquo;
        </p>
      ) : null}

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
          Aucun produit ne correspond à votre recherche pour le moment.
        </p>
      )}
    </>
  );
}
