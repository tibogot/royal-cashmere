import { searchProducts } from "@/lib/boutique-filters";
import { getAllProducts } from "@/lib/shopify/products";
import { NextResponse } from "next/server";

const MAX_RESULTS = 6;
const MIN_QUERY_LENGTH = 2;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";

  if (query.length < MIN_QUERY_LENGTH) {
    return NextResponse.json({ products: [], total: 0 });
  }

  const products = await getAllProducts();
  const matches = searchProducts(products, query);

  return NextResponse.json(
    {
      products: matches.slice(0, MAX_RESULTS),
      total: matches.length,
    },
    {
      headers: {
        "Cache-Control":
          "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
