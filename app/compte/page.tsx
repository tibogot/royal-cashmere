import AccountPageView from "@/components/AccountPageView";
import { getCustomerAccountSummary } from "@/lib/shopify/customer-account/customer";
import { isCustomerAccountConfigured } from "@/lib/shopify/customer-account/config";
import { isCustomerLoggedIn } from "@/lib/shopify/customer-account/session";
import { createPageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
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

  const loggedIn = await isCustomerLoggedIn();
  if (!loggedIn) {
    redirect(routes.signIn);
  }

  const account = await getCustomerAccountSummary();

  if (!account.ok) {
    redirect(routes.signIn);
  }

  return (
    <main className="w-full">
      <section className="bg-white px-4 pt-32 pb-20 text-black md:px-8 md:pt-40 md:pb-32">
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
