import SignInView from "@/components/SignInView";
import { getValidCustomerSession } from "@/lib/shopify/customer-account/auth";
import { isCustomerAccountConfigured } from "@/lib/shopify/customer-account/config";
import { createPageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { redirect } from "next/navigation";

export const metadata = createPageMetadata({
  title: "Connexion",
  description:
    "Connectez-vous à votre compte Royal Cashmere pour suivre vos commandes.",
  path: "/connexion",
});

type SignInPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;

  if (isCustomerAccountConfigured() && (await getValidCustomerSession())) {
    redirect(routes.account);
  }

  return (
    <main className="flex w-full flex-1 flex-col">
      <section className="flex-1 bg-white px-4 pt-32 pb-20 text-black md:px-8 md:pt-40 md:pb-32">
        <h1 className="text-center font-serif text-5xl uppercase leading-[1.12] md:text-7xl">
          Se connecter
        </h1>

        <div className="mt-16">
          <SignInView
            configured={isCustomerAccountConfigured()}
            hasError={params.error === "auth_failed"}
          />
        </div>
      </section>
    </main>
  );
}
