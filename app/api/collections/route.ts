import { getCollections } from "@/lib/shopify/collections";
import { NextResponse } from "next/server";

export async function GET() {
  const collections = await getCollections();

  return NextResponse.json({ collections });
}
