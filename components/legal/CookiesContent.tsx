import LegalPage, {
  LegalList,
  LegalParagraph,
  LegalSection,
} from "@/components/LegalPage";
import {
  getCompanyAddress,
  getLegalIdentifiers,
  legalLastUpdated,
} from "@/lib/legal";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site";
import Link from "next/link";

export default function CookiesContent() {
  const { companyName } = siteConfig.legal;
  const { email } = siteConfig.contact;

  return (
    <LegalPage title="Politique relative aux cookies" lastUpdated={legalLastUpdated}>
      <LegalParagraph>
        La présente politique explique comment {companyName} utilise des
        cookies et technologies similaires sur le site{" "}
        <Link
          href={siteConfig.url}
          className="underline underline-offset-2 transition-opacity hover:opacity-60"
        >
          {siteConfig.url.replace(/^https?:\/\//, "")}
        </Link>
        , conformément à la loi belge du 13 juin 2005 relative aux
        communications électroniques et au Règlement (UE) 2016/679 (RGPD).
      </LegalParagraph>

      <LegalSection title="1. Qu'est-ce qu'un cookie ?">
        <LegalParagraph>
          Un cookie est un petit fichier texte déposé sur votre terminal
          (ordinateur, tablette, smartphone) lors de la consultation d&apos;un
          site internet. Il permet au site de mémoriser certaines informations
          pendant une durée limitée.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="2. Cookies utilisés sur ce site">
        <LegalParagraph>
          Nous utilisons uniquement des cookies strictement nécessaires au
          fonctionnement du site et à la fourniture des services que vous
          demandez. À ce jour, aucun cookie publicitaire ou de mesure
          d&apos;audience tiers n&apos;est déployé sur ce site.
        </LegalParagraph>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[32rem] border-collapse text-left font-serif text-sm text-black/80 md:text-base">
            <thead>
              <tr className="border-b border-black/20">
                <th className="py-3 pr-4 font-serif uppercase tracking-wide text-xs text-black/50">
                  Cookie
                </th>
                <th className="py-3 pr-4 font-serif uppercase tracking-wide text-xs text-black/50">
                  Finalité
                </th>
                <th className="py-3 pr-4 font-serif uppercase tracking-wide text-xs text-black/50">
                  Durée
                </th>
                <th className="py-3 font-serif uppercase tracking-wide text-xs text-black/50">
                  Type
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-black/10">
                <td className="py-3 pr-4 align-top">shopify_cart_id</td>
                <td className="py-3 pr-4 align-top">
                  Mémorisation de votre panier d&apos;achat
                </td>
                <td className="py-3 pr-4 align-top">14 jours</td>
                <td className="py-3 align-top">Strictement nécessaire</td>
              </tr>
              <tr className="border-b border-black/10">
                <td className="py-3 pr-4 align-top">
                  shopify_customer_session
                </td>
                <td className="py-3 pr-4 align-top">
                  Maintien de votre session de compte client
                </td>
                <td className="py-3 pr-4 align-top">Session</td>
                <td className="py-3 align-top">Strictement nécessaire</td>
              </tr>
              <tr className="border-b border-black/10">
                <td className="py-3 pr-4 align-top">
                  shopify_oauth_state, shopify_oauth_nonce,
                  shopify_oauth_code_verifier, shopify_oauth_return_to
                </td>
                <td className="py-3 pr-4 align-top">
                  Sécurisation de la connexion à votre compte client
                </td>
                <td className="py-3 pr-4 align-top">10 minutes</td>
                <td className="py-3 align-top">Strictement nécessaire</td>
              </tr>
            </tbody>
          </table>
        </div>

        <LegalParagraph>
          Lors du paiement, vous êtes redirigé vers la page de paiement
          sécurisée de Shopify, qui peut déposer ses propres cookies nécessaires
          au traitement de la transaction.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="3. Base légale">
        <LegalParagraph>
          Les cookies strictement nécessaires sont déposés sur la base de
          l&apos;intérêt légitime de {companyName} et/ou de la nécessité
          d&apos;exécuter le contrat (gestion du panier, connexion au compte,
          finalisation de commande), conformément à la réglementation
          applicable. Ils ne requièrent pas votre consentement préalable.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="4. Gestion des cookies">
        <LegalParagraph>
          Vous pouvez configurer votre navigateur pour refuser tout ou partie
          des cookies, ou pour être averti avant leur dépôt. Les modalités
          varient selon les navigateurs :
        </LegalParagraph>
        <LegalList
          items={[
            <span key="chrome">
              Chrome : Paramètres → Confidentialité et sécurité → Cookies
            </span>,
            <span key="firefox">
              Firefox : Paramètres → Vie privée et sécurité → Cookies
            </span>,
            <span key="safari">
              Safari : Réglages → Confidentialité → Cookies
            </span>,
            <span key="edge">
              Edge : Paramètres → Cookies et autorisations de site
            </span>,
          ]}
        />
        <LegalParagraph>
          Le refus des cookies strictement nécessaires peut empêcher
          l&apos;utilisation de certaines fonctionnalités du site, notamment
          l&apos;ajout d&apos;articles au panier ou la connexion à votre
          compte.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="5. Données personnelles">
        <LegalParagraph>
          Pour en savoir plus sur le traitement de vos données personnelles,
          consultez notre{" "}
          <Link
            href={routes.privacy}
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            politique de confidentialité
          </Link>
          .
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="6. Contact">
        <LegalParagraph>
          Pour toute question relative aux cookies, contactez-nous à{" "}
          <a
            href={`mailto:${email}`}
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            {email}
          </a>
          .
        </LegalParagraph>
      </LegalSection>
    </LegalPage>
  );
}
