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
import { siteConfig } from "@/lib/site";
import Link from "next/link";
import { routes } from "@/lib/routes";

export default function MentionsLegalesContent() {
  const { companyName, hosting } = siteConfig.legal;
  const { email, phone } = siteConfig.contact;
  const { enterpriseNumber, vatNumber, legalForm } = getLegalIdentifiers();

  return (
    <LegalPage title="Mentions légales" lastUpdated={legalLastUpdated}>
      <LegalSection title="Éditeur du site">
        <LegalParagraph>
          Le présent site internet{" "}
          <Link
            href={siteConfig.url}
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            {siteConfig.url.replace(/^https?:\/\//, "")}
          </Link>{" "}
          est édité par :
        </LegalParagraph>
        <LegalList
          items={[
            <span key="name">
              <strong>{companyName}</strong>
              {legalForm ? ` (${legalForm})` : null}
            </span>,
            <span key="address">Siège et adresse : {getCompanyAddress()}</span>,
            enterpriseNumber ? (
              <span key="bce">
                Numéro d&apos;entreprise (BCE) :{" "}
                {formatEnterpriseNumber(enterpriseNumber)}
              </span>
            ) : (
              <span key="bce">
                Numéro d&apos;entreprise (BCE) : communiqué sur demande à{" "}
                <a
                  href={`mailto:${email}`}
                  className="underline underline-offset-2 transition-opacity hover:opacity-60"
                >
                  {email}
                </a>
              </span>
            ),
            vatNumber ? (
              <span key="vat">Numéro de TVA : {vatNumber}</span>
            ) : null,
            <span key="phone">
              Téléphone :{" "}
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="underline underline-offset-2 transition-opacity hover:opacity-60"
              >
                {phone}
              </a>
            </span>,
            <span key="email">
              E-mail :{" "}
              <a
                href={`mailto:${email}`}
                className="underline underline-offset-2 transition-opacity hover:opacity-60"
              >
                {email}
              </a>
            </span>,
          ].filter(Boolean)}
        />
      </LegalSection>

      <LegalSection title="Activité">
        <LegalParagraph>
          {companyName} est une boutique spécialisée dans la vente de vêtements,
          accessoires et articles en cachemire, en boutique à Uccle (Bruxelles)
          et en ligne via le présent site.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Hébergement">
        <LegalParagraph>
          Le site est hébergé par {hosting.provider}, {hosting.address}. Site web
          :{" "}
          <a
            href={hosting.website}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            {hosting.website.replace(/^https?:\/\//, "")}
          </a>
          .
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Propriété intellectuelle">
        <LegalParagraph>
          L&apos;ensemble des éléments composant le site (textes, photographies,
          illustrations, logos, vidéos, mise en page, charte graphique, etc.)
          est protégé par le droit d&apos;auteur et le droit des marques. Toute
          reproduction, représentation, modification ou exploitation, totale ou
          partielle, sans autorisation écrite préalable de {companyName} est
          interdite.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Responsabilité">
        <LegalParagraph>
          {companyName} s&apos;efforce d&apos;assurer l&apos;exactitude et la
          mise à jour des informations diffusées sur ce site. Toutefois, elle ne
          saurait garantir l&apos;exactitude, la précision ou l&apos;exhaustivité
          des informations mises à disposition. L&apos;utilisation du site
          s&apos;effectue sous la seule responsabilité de l&apos;utilisateur.
        </LegalParagraph>
        <LegalParagraph>
          Le site peut contenir des liens vers des sites tiers. {companyName}{" "}
          n&apos;exerce aucun contrôle sur ces sites et décline toute
          responsabilité quant à leur contenu.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Données personnelles et cookies">
        <LegalParagraph>
          Pour toute information relative au traitement de vos données
          personnelles, consultez notre{" "}
          <Link
            href={routes.privacy}
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            politique de confidentialité
          </Link>
          . Pour les cookies utilisés sur ce site, consultez notre{" "}
          <Link
            href={routes.cookies}
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            politique relative aux cookies
          </Link>
          .
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Droit applicable">
        <LegalParagraph>
          Le présent site est soumis au droit belge. En cas de litige, et à
          défaut de résolution amiable, les tribunaux compétents de
          l&apos;arrondissement judiciaire de Bruxelles seront seuls compétents,
          sous réserve des dispositions légales impératives applicables aux
          consommateurs.
        </LegalParagraph>
      </LegalSection>
    </LegalPage>
  );
}
