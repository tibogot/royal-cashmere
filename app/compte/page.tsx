import AccountPageView from "@/components/AccountPageView";
import { getValidCustomerSession } from "@/lib/shopify/customer-account/auth";
import { getCustomerAccountSummary } from "@/lib/shopify/customer-account/customer";
import { isCustomerAccountConfigured } from "@/lib/shopify/customer-account/config";
import { createPageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { redirect } from "next/navigation";

export const metadata = createPageMetadata({
  title: "Mon compte",
  description:
    "Consultez vos commandes et gÃ©rez votre compte client Royal Cashmere.",
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
    <main className="flex w-full flex-1 flex-col">
      <section className="flex-1 bg-white px-4 pt-24 pb-20 text-black md:px-8 md:pt-28 md:pb-32">
        <h1 className="text-center font-serif text-5xl uppercase leading-[1.12] md:text-7xl">
          Mon compte
        </h1>

        <div className="mt-16">
          <AccountPageView
            customer={account.customer}
            orders={account.orders}
          />
        </div>
      </section>
    </main>
  );
}
