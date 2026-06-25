import { routes } from "@/lib/routes";
import Link from "next/link";

type SignInViewProps = {
  configured: boolean;
  hasError?: boolean;
};

export default function SignInView({ configured, hasError }: SignInViewProps) {
  if (!configured) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <p className="text-sm leading-relaxed text-black/70 md:text-base">
          La connexion client n&apos;est pas encore configurée. Ajoutez vos
          identifiants Customer Account API dans votre fichier{" "}
          <code className="text-black">.env</code> et configurez les URLs de
          redirection dans Shopify Admin (Headless → Customer Account API).
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl text-center">
      <p className="text-sm leading-relaxed text-black/70 md:text-base">
        Connectez-vous pour consulter vos commandes et gérer votre compte Royal
        Cashmere.
      </p>

      {hasError ? (
        <p className="mt-4 text-sm text-red-700">
          La connexion a échoué. Veuillez réessayer.
        </p>
      ) : null}

      <Link
        href={`${routes.authLogin}?return_to=${encodeURIComponent(routes.account)}`}
        className="mt-10 inline-flex items-center justify-center border border-black px-8 py-3 text-sm uppercase tracking-wide transition-opacity hover:opacity-60"
      >
        Se connecter
      </Link>

      <p className="mt-8 text-xs leading-relaxed text-black/50">
        Vous serez redirigé vers la page de connexion sécurisée Shopify.
      </p>
    </div>
  );
}
