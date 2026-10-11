import AccountPageView from "@/components/AccountPageView";
import { getValidCustomerSession } from "@/lib/shopify/customer-account/auth";
import { getCustomerAccountSummary } from "@/lib/shopify/customer-account/customer";
import { isCustomerAccountConfigured } from "@/lib/shopify/customer-account/config";
import { createPageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import Image from "next/image";
import { redirect } from "next/navigation";

export const metadata = createPageMetadata({
  title: "Mon compte",
  description:
    "Consultez vos commandes et gérez votre compte client Royal Cashmere.",
  path: "/compte",
});

export default async function AccountPage() {
  if (!isCustomerAccountConfigured()) {
    redirect(routes.signIn);
  }

  const session = await getValidCustomerSession();
  if (!session) {
    redirect(routes.signIn);
  }

  const account = await getCustomerAccountSummary();

  if (!account.ok) {
    redirect(routes.signIn);
  }

  return (
    <main className="w-full">
      <section className="bg-white px-4 pt-24 pb-20 text-black md:px-8 md:pt-28 md:pb-32">
        <h1 className="sr-only">Mon compte — Royal Cashmere</h1>

        <div className="grid gap-16 md:grid-cols-2 md:gap-20">
          <AccountPageView
            customer={account.customer}
            orders={account.orders}
          />

          <div className="relative min-h-80 w-full md:min-h-[calc(100svh-7rem)]">
            <Image
              src="/images/chu-william-DQkDC6-3vnQ-unsplash.jpg"
              alt="Cachemire Royal Cashmere"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
