import { getProductsByHandles } from "@/lib/shopify/products";
import { NextResponse } from "next/server";

// Cap the number of handles so a single request can't fan out into an
// unbounded number of Shopify lookups.
const MAX_HANDLES = 50;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const handles = (
    searchParams
      .get("handles")
      ?.split(",")
      .map((handle) => handle.trim())
      .filter(Boolean) ?? []
  ).slice(0, MAX_HANDLES);

  if (handles.length === 0) {
    return NextResponse.json({ products: [] });
  }

  const products = await getProductsByHandles(handles);
  const productsByHandle = new Map(
    products.map((product) => [product.handle, product]),
  );
  const orderedProducts = handles
    .map((handle) => productsByHandle.get(handle))
    .filter((product) => product !== undefined);

  return NextResponse.json(
    { products: orderedProducts },
    {
      headers: {
        "Cache-Control":
          "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
