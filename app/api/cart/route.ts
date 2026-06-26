import { getCart } from "@/app/actions/cart";
import { NextResponse } from "next/server";

export async function GET() {
  const cart = await getCart();

  return NextResponse.json({
    totalQuantity: cart?.totalQuantity ?? 0,
    cart,
  });
}
