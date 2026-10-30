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
import Link from "@/components/LocaleLink";

/** The Belgian data protection authority under its Dutch name. */
const dataProtectionAuthority = {
  name: "Gegevensbeschermingsautoriteit (GBA)",
  website: "https://www.gegevensbeschermingsautoriteit.be",
};

export default function PolitiqueConfidentialiteContent() {
  const { companyName } = siteConfig.legal;
  const { email, phone } = siteConfig.contact;
  const { enterpriseNumber, vatNumber } = getLegalIdentifiers();

  return (
    <LegalPage
      title="Privacybeleid"
      locale="nl"
      lastUpdated={legalLastUpdated}
    >
      <LegalParagraph>
        Dit privacybeleid beschrijft hoe {companyName} uw persoonsgegevens
        verzamelt, gebruikt en beschermt overeenkomstig Verordening (EU)
        2016/679 (Algemene Verordening Gegevensbescherming, AVG) en de
        Belgische wet van 30 juli 2018 betreffende de bescherming van
        natuurlijke personen met betrekking tot de verwerking van
        persoonsgegevens.
      </LegalParagraph>

      <LegalSection title="1. Verwerkingsverantwoordelijke">
        <LegalList
          items={[
            <span key="name">
              <strong>{companyName}</strong>
            </span>,
            <span key="address">{getCompanyAddress("nl")}</span>,
            enterpriseNumber ? (
              <span key="bce">Ondernemingsnummer: {enterpriseNumber}</span>
            ) : null,
            vatNumber ? (
              <span key="vat">Btw-nummer: {vatNumber}</span>
            ) : null,
            <span key="email">
              E-mail:{" "}
              <a
                href={`mailto:${email}`}
                className="underline underline-offset-2 transition-opacity hover:opacity-60"
              >
                {email}
              </a>
            </span>,
            <span key="phone">
              Telefoon:{" "}
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

      <LegalSection title="2. Verzamelde gegevens">
        <LegalParagraph>
          Afhankelijk van uw interacties met onze website en onze winkel kunnen
          wij de volgende categorieën van gegevens verwerken:
        </LegalParagraph>
        <LegalList
          items={[
            "Identificatie- en contactgegevens: naam, voornaam, e-mailadres, telefoonnummer, postadres.",
            "Bestelgegevens: gekochte producten, bedragen, bestelgeschiedenis, leverings- en facturatiegegevens.",
            "Gegevens van uw klantaccount: aanmeldgegevens en voorkeuren met betrekking tot uw account, in voorkomend geval.",
            "Communicatiegegevens: inhoud van de berichten die u via ons contactformulier of per e-mail verstuurt.",
            "Technische gegevens: IP-adres, type browser, bezochte pagina's, cookies (zie ons cookiebeleid).",
          ]}
        />
      </LegalSection>

      <LegalSection title="3. Doeleinden en rechtsgronden">
        <LegalList
          items={[
            "Beheer van bestellingen, levering en dienst na verkoop (uitvoering van de overeenkomst).",
            "Aanmaak en beheer van uw klantaccount (uitvoering van de overeenkomst of precontractuele maatregelen).",
            "Beantwoording van uw contactaanvragen (gerechtvaardigd belang of precontractuele maatregelen).",
            "Naleving van onze wettelijke en boekhoudkundige verplichtingen (wettelijke verplichting).",
            "Verbetering van de website, beveiliging en fraudepreventie (gerechtvaardigd belang).",
            "Verzending van commerciële communicatie, uitsluitend met uw toestemming wanneer de wet dat vereist.",
          ]}
        />
      </LegalSection>

      <LegalSection title="4. Ontvangers van de gegevens">
        <LegalParagraph>
          Uw gegevens kunnen worden meegedeeld aan de volgende ontvangers, voor
          zover dat nodig is voor hun opdrachten:
        </LegalParagraph>
        <LegalList
          items={[
            "Shopify International Limited en haar dochterondernemingen, voor de verwerking van onlinebestellingen en betalingen, het beheer van klantaccounts en de hosting van de webwinkel.",
            "Vercel Inc., voor de technische hosting van de website.",
            "Resend, voor het verzenden van de berichten via het contactformulier.",
            "Sanity.io, voor het redactionele beheer van de inhoud van het journal.",
            "Leverings- en betaaldienstverleners die betrokken zijn bij de uitvoering van uw bestelling.",
            "Administratieve of gerechtelijke autoriteiten, wanneer de wet dat oplegt.",
          ]}
        />
        <LegalParagraph>
          Sommige van deze dienstverleners kunnen gevestigd zijn buiten de
          Europese Economische Ruimte. In dat geval worden passende waarborgen
          ingesteld overeenkomstig de AVG (modelcontractbepalingen,
          adequaatheidsbesluiten of andere erkende mechanismen).
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="5. Bewaartermijnen">
        <LegalList
          items={[
            "Bestel- en facturatiegegevens: bewaard gedurende de wettelijke termijn die geldt op boekhoudkundig en fiscaal vlak (in België doorgaans 7 jaar).",
            "Gegevens van uw klantaccount: bewaard zolang het account actief is, en daarna gearchiveerd of verwijderd overeenkomstig onze wettelijke verplichtingen.",
            "Contactgegevens: bewaard zolang nodig is voor de behandeling van uw aanvraag, en daarna gearchiveerd indien een geschil mogelijk is.",
            "Technische gegevens en cookies: volgens de termijnen vermeld in ons cookiebeleid.",
          ]}
        />
      </LegalSection>

      <LegalSection title="6. Uw rechten">
        <LegalParagraph>
          Overeenkomstig de AVG beschikt u over de volgende rechten met
          betrekking tot uw persoonsgegevens:
        </LegalParagraph>
        <LegalList
          items={[
            "Recht op inzage en rectificatie.",
            "Recht op gegevenswissing, binnen de grenzen van de wet.",
            "Recht op beperking van de verwerking.",
            "Recht van bezwaar, met name tegen verwerking op grond van het gerechtvaardigd belang.",
            "Recht op overdraagbaarheid van de gegevens die u ons hebt verstrekt, wanneer de verwerking geautomatiseerd gebeurt en gebaseerd is op de overeenkomst of op toestemming.",
            "Recht om uw toestemming op elk ogenblik in te trekken, zonder afbreuk te doen aan de rechtmatigheid van de verwerking vóór de intrekking.",
          ]}
        />
        <LegalParagraph>
          Om uw rechten uit te oefenen, kunt u contact met ons opnemen via{" "}
          <a
            href={`mailto:${email}`}
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            {email}
          </a>
          . Wij kunnen u om een bewijs van uw identiteit vragen. U hebt ook het
          recht een klacht in te dienen bij de {dataProtectionAuthority.name}:{" "}
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

      <LegalSection title="7. Beveiliging">
        <LegalParagraph>
          Wij nemen passende technische en organisatorische maatregelen om uw
          gegevens te beschermen tegen onopzettelijke of onrechtmatige
          vernietiging, verlies, wijziging, openbaarmaking of ongeoorloofde
          toegang.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="8. Cookies">
        <LegalParagraph>
          Meer informatie over het gebruik van cookies vindt u in ons{" "}
          <Link
            href={routes.cookies}
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            cookiebeleid
          </Link>
          .
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="9. Wijzigingen">
        <LegalParagraph>
          Wij kunnen dit beleid op elk ogenblik wijzigen. De geldende versie is
          de versie die op deze pagina is gepubliceerd, met vermelding van de
          datum van de laatste bijwerking.
        </LegalParagraph>
      </LegalSection>
    </LegalPage>
  );
}
