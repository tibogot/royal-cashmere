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

export default function PolitiqueConfidentialiteContent() {
  const { companyName, dataProtectionAuthority } = siteConfig.legal;
  const { email, phone } = siteConfig.contact;
  const { enterpriseNumber, vatNumber } = getLegalIdentifiers();

  return (
    <LegalPage
      title="Politique de confidentialité"
      lastUpdated={legalLastUpdated}
    >
      <LegalParagraph>
        La présente politique de confidentialité décrit la manière dont{" "}
        {companyName} collecte, utilise et protège vos données personnelles
        conformément au Règlement (UE) 2016/679 (RGPD) et à la loi belge du 30
        juillet 2018 relative à la protection des personnes physiques à
        l&apos;égard des traitements de données à caractère personnel.
      </LegalParagraph>

      <LegalSection title="1. Responsable du traitement">
        <LegalList
          items={[
            <span key="name">
              <strong>{companyName}</strong>
            </span>,
            <span key="address">{getCompanyAddress()}</span>,
            enterpriseNumber ? (
              <span key="bce">Numéro d&apos;entreprise : {enterpriseNumber}</span>
            ) : null,
            vatNumber ? (
              <span key="vat">Numéro de TVA : {vatNumber}</span>
            ) : null,
            <span key="email">
              E-mail :{" "}
              <a
                href={`mailto:${email}`}
                className="underline underline-offset-2 transition-opacity hover:opacity-60"
              >
                {email}
              </a>
            </span>,
            <span key="phone">
              Téléphone :{" "}
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="underline underline-offset-2 transition-opacity hover:opacity-60"
              >
                {phone}
              </a>
            </span>,
          ].filter(Boolean)}
        />
      </LegalSection>

      <LegalSection title="2. Données collectées">
        <LegalParagraph>
          Selon vos interactions avec notre site et notre boutique, nous pouvons
          traiter les catégories de données suivantes :
        </LegalParagraph>
        <LegalList
          items={[
            "Données d'identification et de contact : nom, prénom, adresse e-mail, numéro de téléphone, adresse postale.",
            "Données de commande : produits achetés, montants, historique de commandes, informations de livraison et de facturation.",
            "Données de compte client : identifiants de connexion et préférences liées à votre compte, le cas échéant.",
            "Données de communication : contenu des messages envoyés via notre formulaire de contact ou par e-mail.",
            "Données techniques : adresse IP, type de navigateur, pages consultées, cookies (voir notre politique cookies).",
          ]}
        />
      </LegalSection>

      <LegalSection title="3. Finalités et bases légales">
        <LegalList
          items={[
            "Gestion des commandes, livraison et service après-vente (exécution du contrat).",
            "Création et gestion de votre compte client (exécution du contrat ou mesures précontractuelles).",
            "Réponse à vos demandes de contact (intérêt légitime ou mesures précontractuelles).",
            "Respect de nos obligations légales et comptables (obligation légale).",
            "Amélioration du site, sécurité et prévention de la fraude (intérêt légitime).",
            "Envoi de communications commerciales, uniquement avec votre consentement lorsque la loi l'exige.",
          ]}
        />
      </LegalSection>

      <LegalSection title="4. Destinataires des données">
        <LegalParagraph>
          Vos données peuvent être communiquées aux destinataires suivants,
          dans la limite nécessaire à leurs missions :
        </LegalParagraph>
        <LegalList
          items={[
            "Shopify International Limited et ses filiales, pour le traitement des commandes en ligne, des paiements, de la gestion des comptes clients et de l'hébergement de la boutique.",
            "Vercel Inc., pour l'hébergement technique du site internet.",
            "Resend, pour l'envoi des messages issus du formulaire de contact.",
            "Sanity.io, pour la gestion éditoriale du contenu du journal.",
            "Prestataires de livraison et de paiement intervenant dans l'exécution de votre commande.",
            "Autorités administratives ou judiciaires, lorsque la loi l'impose.",
          ]}
        />
        <LegalParagraph>
          Certains de ces prestataires peuvent être situés en dehors de
          l&apos;Espace économique européen. Dans ce cas, des garanties
          appropriées sont mises en place conformément au RGPD (clauses
          contractuelles types, décisions d&apos;adéquation ou autres
          mécanismes reconnus).
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="5. Durées de conservation">
        <LegalList
          items={[
            "Données de commande et de facturation : conservées pendant la durée légale applicable en matière comptable et fiscale (généralement 7 ans en Belgique).",
            "Données de compte client : conservées tant que le compte est actif, puis archivées ou supprimées conformément à nos obligations légales.",
            "Données de contact : conservées le temps nécessaire au traitement de votre demande, puis archivées si un litige est possible.",
            "Données techniques et cookies : selon les durées indiquées dans notre politique cookies.",
          ]}
        />
      </LegalSection>

      <LegalSection title="6. Vos droits">
        <LegalParagraph>
          Conformément au RGPD, vous disposez des droits suivants concernant
          vos données personnelles :
        </LegalParagraph>
        <LegalList
          items={[
            "Droit d'accès et de rectification.",
            "Droit à l'effacement, dans les limites prévues par la loi.",
            "Droit à la limitation du traitement.",
            "Droit d'opposition, notamment au traitement fondé sur l'intérêt légitime.",
            "Droit à la portabilité des données que vous nous avez fournies, lorsque le traitement est automatisé et fondé sur le contrat ou le consentement.",
            "Droit de retirer votre consentement à tout moment, sans affecter la licéité du traitement antérieur.",
          ]}
        />
        <LegalParagraph>
          Pour exercer vos droits, contactez-nous à{" "}
          <a
            href={`mailto:${email}`}
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            {email}
          </a>
          . Nous pourrons vous demander une preuve d&apos;identité. Vous
          disposez également du droit d&apos;introduire une réclamation auprès
          de l&apos;{dataProtectionAuthority.name} :{" "}
          <a
            href={dataProtectionAuthority.website}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            {dataProtectionAuthority.website.replace(/^https?:\/\//, "")}
          </a>
          .
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="7. Sécurité">
        <LegalParagraph>
          Nous mettons en œuvre des mesures techniques et organisationnelles
          appropriées pour protéger vos données contre la destruction
          accidentelle ou illicite, la perte, l&apos;altération, la divulgation
          ou l&apos;accès non autorisé.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="8. Cookies">
        <LegalParagraph>
          Pour plus d&apos;informations sur l&apos;utilisation des cookies,
          consultez notre{" "}
          <Link
            href={routes.cookies}
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            politique relative aux cookies
          </Link>
          .
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="9. Modifications">
        <LegalParagraph>
          Nous pouvons modifier la présente politique à tout moment. La version
          en vigueur est celle publiée sur cette page, avec indication de la date
          de dernière mise à jour.
        </LegalParagraph>
      </LegalSection>
    </LegalPage>
  );
}
