import { getProductsByHandles } from "@/lib/shopify/products";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const handles =
    searchParams
      .get("handles")
      ?.split(",")
      .map((handle) => handle.trim())
      .filter(Boolean) ?? [];

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

  return NextResponse.json({ products: orderedProducts });
}
