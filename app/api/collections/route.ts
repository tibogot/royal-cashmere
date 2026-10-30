import { toLocale } from "@/lib/i18n/config";
import { getShopNav } from "@/lib/shopify/collections";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const locale = toLocale(
    new URL(request.url).searchParams.get("locale") ?? undefined,
  );
  const nav = await getShopNav(locale);

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
