import { getShopNav } from "@/lib/shopify/collections";
import { NextResponse } from "next/server";

export async function GET() {
  const nav = await getShopNav();

  return NextResponse.json(
    nav,
    {
      headers: {
        "Cache-Control":
          "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
