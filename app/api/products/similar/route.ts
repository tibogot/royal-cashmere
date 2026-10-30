import {
  enrichProductsForQuickAdd,
  getFeaturedProducts,
  getSimilarProductsByHandle,
} from "@/lib/shopify/products";
import { toLocale } from "@/lib/i18n/config";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const handle = searchParams.get("handle")?.trim();
  const locale = toLocale(searchParams.get("locale") ?? undefined);
  const limit = Number(searchParams.get("limit") ?? 4);
  const safeLimit = Number.isFinite(limit) ? limit : 4;

  const excludeHandles =
    searchParams
      .get("exclude")
      ?.split(",")
      .map((value) => value.trim())
      .filter(Boolean) ?? [];

  const products = handle
    ? await getSimilarProductsByHandle(handle, locale, {
        limit: safeLimit,
        excludeHandles,
      })
    : await getFeaturedProducts(safeLimit, locale);

  const enriched = await enrichProductsForQuickAdd(products, locale);

  return NextResponse.json({ products: enriched });
}
