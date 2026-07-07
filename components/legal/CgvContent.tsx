import LegalPage, {
  LegalList,
  LegalParagraph,
  LegalSection,
} from "@/components/LegalPage";
import {
  formatEnterpriseNumber,
  getCompanyAddress,
  getLegalIdentifiers,
  legalLastUpdated,
} from "@/lib/legal";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site";
import Link from "next/link";

export default function CgvContent() {
  const { companyName, mediation } = siteConfig.legal;
  const { email, phone } = siteConfig.contact;
  const { enterpriseNumber, vatNumber, legalForm } = getLegalIdentifiers();

  return (
    <LegalPage
      title="Conditions générales de vente"
      lastUpdated={legalLastUpdated}
    >
      <LegalParagraph>
        Les présentes conditions générales de vente (ci-après « CGV »)
        régissent les ventes de produits effectuées par {companyName}, en
        boutique et à distance via le site{" "}
        <Link
          href={siteConfig.url}
          className="underline underline-offset-2 transition-opacity hover:opacity-60"
        >
          {siteConfig.url.replace(/^https?:\/\//, "")}
        </Link>
        . Elles s&apos;appliquent à toute commande passée par un consommateur
        au sens du Code de droit économique belge.
      </LegalParagraph>

      <LegalSection title="1. Vendeur">
        <LegalList
          items={[
            <span key="name">
              <strong>{companyName}</strong>
              {legalForm ? ` (${legalForm})` : null}
            </span>,
            <span key="address">{getCompanyAddress()}</span>,
            enterpriseNumber ? (
              <span key="bce">
                Numéro d&apos;entreprise :{" "}
                {formatEnterpriseNumber(enterpriseNumber)}
              </span>
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
        <LegalParagraph>
          Horaires de la boutique : du lundi au vendredi, de 10 h à 18 h.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="2. Produits">
        <LegalParagraph>
          {companyName} commercialise des vêtements, accessoires et articles en
          cachemire et matières associées. Les photographies et descriptions
          présentées sur le site sont aussi fidèles que possible mais ne
          sauraient engager la responsabilité du vendeur pour de légères
          différences de teinte, de texture ou de finition inhérentes aux
          matières naturelles.
        </LegalParagraph>
        <LegalParagraph>
          Les produits sont proposés dans la limite des stocks disponibles. En
          cas d&apos;indisponibilité après commande, le client en sera informé
          dans les meilleurs délais et pourra demander l&apos;annulation de sa
          commande avec remboursement des sommes versées.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="3. Prix">
        <LegalParagraph>
          Les prix sont indiqués en euros (€) et s&apos;entendent toutes taxes
          comprises (TTC) pour les consommateurs belges, sauf indication
          contraire. Les frais de livraison, le cas échéant, sont indiqués avant
          la validation définitive de la commande.
        </LegalParagraph>
        <LegalParagraph>
          {companyName} se réserve le droit de modifier ses prix à tout moment.
          Les produits sont facturés sur la base des tarifs en vigueur au moment
          de la validation de la commande.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="4. Commande et conclusion du contrat">
        <LegalParagraph>
          Pour passer commande en ligne, le client sélectionne les produits,
          les ajoute au panier, puis procède au paiement via la page sécurisée
          Shopify. La commande n&apos;est définitive qu&apos;après confirmation
          du paiement et réception de l&apos;e-mail de confirmation de commande.
        </LegalParagraph>
        <LegalParagraph>
          {companyName} se réserve le droit de refuser ou d&apos;annuler toute
          commande en cas de litige antérieur, de suspicion de fraude ou
          d&apos;informations manifestement erronées.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="5. Paiement">
        <LegalParagraph>
          Le paiement s&apos;effectue en ligne via les moyens de paiement
          proposés sur la page de paiement sécurisée (cartes bancaires et autres
          moyens disponibles selon les options Shopify). En boutique, le paiement
          peut être effectué selon les modalités acceptées en magasin.
        </LegalParagraph>
        <LegalParagraph>
          Les données de paiement sont traitées directement par le prestataire
          de paiement ; {companyName} ne conserve pas les coordonnées complètes
          de carte bancaire.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="6. Livraison et retrait">
        <LegalList
          items={[
            "Livraison en Europe : les délais et frais de livraison sont indiqués lors du passage de commande.",
            "Retrait en boutique : disponible à l'adresse indiquée ci-dessus, aux horaires d'ouverture, après confirmation de la disponibilité des articles commandés.",
          ]}
        />
        <LegalParagraph>
          Les délais de livraison sont donnés à titre indicatif. Un retard
          raisonnable ne peut donner lieu à l&apos;annulation de la commande ni
          à des dommages et intérêts, sauf en cas de dépassement manifeste et
          après mise en demeure restée sans effet.
        </LegalParagraph>
        <LegalParagraph>
          Le transfert des risques et de la propriété intervient à la livraison
          effective des produits au client ou au transporteur, selon les
          conditions applicables.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="7. Droit de rétractation">
        <LegalParagraph>
          Conformément au livre VI du Code de droit économique belge, le
          consommateur dispose d&apos;un délai de 14 jours calendriers à
          compter du jour de réception des biens pour exercer son droit de
          rétractation, sans avoir à motiver sa décision ni à supporter de
          frais, à l&apos;exception des frais de retour.
        </LegalParagraph>
        <LegalParagraph>
          Pour exercer ce droit, le client doit notifier sa décision à{" "}
          {companyName} par e-mail à{" "}
          <a
            href={`mailto:${email}`}
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            {email}
          </a>{" "}
          ou par courrier à l&apos;adresse du vendeur, avant l&apos;expiration
          du délai de rétractation.
        </LegalParagraph>
        <LegalParagraph>
          Les produits doivent être retournés dans leur état d&apos;origine,
          non portés, non lavés, avec leurs étiquettes et emballages d&apos;origine
          intacts, dans un délai de 14 jours suivant la communication de la
          décision de rétractation. {companyName} se réserve le droit de
          refuser le remboursement si les produits présentent des signes
          d&apos;utilisation ou de détérioration.
        </LegalParagraph>
        <LegalParagraph>
          Le remboursement des sommes versées, y compris les frais de livraison
          standard initiaux le cas échéant, interviendra au plus tard dans
          les 14 jours suivant la réception des produits retournés ou la preuve
          de leur expédition, selon la première éventualité, par le même moyen
          de paiement que celui utilisé pour la commande, sauf accord contraire.
        </LegalParagraph>
        <LegalParagraph>
          <strong>Exceptions :</strong> conformément à la loi, le droit de
          rétractation ne s&apos;applique notamment pas aux biens confectionnés
          selon les spécifications du consommateur ou nettement personnalisés,
          ni aux biens susceptibles de se détériorer rapidement ou descellés
          après livraison et ne pouvant être renvoyés pour des raisons
          d&apos;hygiène ou de protection de la santé.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="8. Garanties légales">
        <LegalParagraph>
          Tous les produits bénéficient de la garantie légale de conformité
          prévue par le livre VI du Code de droit économique belge (2 ans à
          compter de la délivrance du bien pour les biens neufs) et de la
          garantie contre les vices cachés conformément au Code civil belge.
        </LegalParagraph>
        <LegalParagraph>
          En cas de défaut de conformité, le consommateur peut demander la
          réparation ou le remplacement du bien. Si cela n&apos;est pas possible
          ou disproportionné, il peut demander une réduction du prix ou la
          résolution de la vente, dans les conditions prévues par la loi.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="9. Réclamations et médiation">
        <LegalParagraph>
          Pour toute réclamation, contactez-nous à{" "}
          <a
            href={`mailto:${email}`}
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            {email}
          </a>{" "}
          ou au{" "}
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            {phone}
          </a>
          . Nous nous engageons à répondre dans les meilleurs délais.
        </LegalParagraph>
        <LegalParagraph>
          En cas de litige non résolu à l&apos;amiable, le consommateur peut
          recourir gratuitement au {mediation.name} :{" "}
          <a
            href={mediation.website}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            {mediation.website.replace(/^https?:\/\//, "")}
          </a>{" "}
          —{" "}
          <a
            href={`mailto:${mediation.email}`}
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            {mediation.email}
          </a>
          .
        </LegalParagraph>
        <LegalParagraph>
          Le consommateur peut également utiliser la plateforme européenne de
          règlement en ligne des litiges :{" "}
          <a
            href="https://ec.europa.eu/consumers/odr"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            ec.europa.eu/consumers/odr
          </a>
          .
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="10. Données personnelles">
        <LegalParagraph>
          Les données collectées dans le cadre des commandes sont traitées
          conformément à notre{" "}
          <Link
            href={routes.privacy}
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            politique de confidentialité
          </Link>
          .
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="11. Droit applicable et juridiction compétente">
        <LegalParagraph>
          Les présentes CGV sont soumises au droit belge. En cas de litige, et
          à défaut de résolution amiable ou de médiation fructueuse, les
          tribunaux compétents seront déterminés conformément aux règles légales
          applicables, le consommateur pouvant également saisir le tribunal du
          lieu où il demeure ou du lieu de livraison effective.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="12. Acceptation">
        <LegalParagraph>
          La validation d&apos;une commande en ligne vaut acceptation pleine et
          entière des présentes CGV. {companyName} se réserve le droit de
          modifier les CGV à tout moment ; les conditions applicables sont celles
          en vigueur à la date de la commande.
        </LegalParagraph>
      </LegalSection>
    </LegalPage>
  );
}
