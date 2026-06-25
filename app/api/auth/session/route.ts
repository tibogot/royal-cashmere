import { getCustomerProfile } from "@/lib/shopify/customer-account/customer";
import { getCustomerDisplayName } from "@/lib/shopify/customer-account/display-name";
import { isCustomerLoggedIn } from "@/lib/shopify/customer-account/session";
import { NextResponse } from "next/server";

export async function GET() {
  const loggedIn = await isCustomerLoggedIn();

  if (!loggedIn) {
    return NextResponse.json({ loggedIn: false });
  }

  const profile = await getCustomerProfile();

  if (!profile.ok || !profile.customer) {
    return NextResponse.json({ loggedIn: true });
  }

  return NextResponse.json({
    loggedIn: true,
    displayName: getCustomerDisplayName(profile.customer),
  });
}
