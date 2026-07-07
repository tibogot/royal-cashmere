import { getCollections } from "@/lib/shopify/collections";
import { NextResponse } from "next/server";

export async function GET() {
  const collections = await getCollections();

  return NextResponse.json(
    { collections },
    {
      headers: {
        "Cache-Control":
          "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
