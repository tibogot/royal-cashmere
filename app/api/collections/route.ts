import { getCatalogNav } from "@/lib/shopify/collections";
import { NextResponse } from "next/server";

export async function GET() {
  const sections = await getCatalogNav();

  return NextResponse.json(
    { sections },
    {
      headers: {
        "Cache-Control":
          "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
