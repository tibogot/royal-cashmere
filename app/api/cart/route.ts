import { getCartCount } from "@/app/actions/cart";
import { NextResponse } from "next/server";

export async function GET() {
  const totalQuantity = await getCartCount();

  return NextResponse.json({ totalQuantity });
}
