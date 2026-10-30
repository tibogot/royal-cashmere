import { getCart } from "@/app/actions/cart";
import { toLocale } from "@/lib/i18n/config";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const locale = toLocale(
    new URL(request.url).searchParams.get("locale") ?? undefined,
  );
  const cart = await getCart(locale);

  return NextResponse.json({
    totalQuantity: cart?.totalQuantity ?? 0,
    cart,
  });
}
