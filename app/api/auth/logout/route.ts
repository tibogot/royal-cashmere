import { buildLogoutUrl } from "@/lib/shopify/customer-account/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const logoutUrl = await buildLogoutUrl();
  return NextResponse.redirect(logoutUrl);
}
