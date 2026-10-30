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
import Link from "@/components/LocaleLink";

/** The Dutch-language name and contact details of the Consumer Ombudsman. */
const mediation = {
  name: "Consumentenombudsdienst",
  website: "https://www.consumentenombudsdienst.be",
  email: "contact@consumentenombudsdienst.be",
};

export default function CgvContent() {
  const { companyName } = siteConfig.legal;
  const { email, phone } = siteConfig.contact;
  const { enterpriseNumber, vatNumber, legalForm } = getLegalIdentifiers();

  return (
    <LegalPage
      title="Algemene verkoopvoorwaarden"
      locale="nl"
      lastUpdated={legalLastUpdated}
    >
      <LegalParagraph>
        Deze algemene verkoopvoorwaarden (hierna „AVV”) zijn van toepassing op
        de verkoop van producten door {companyName}, zowel in de winkel als op
        afstand via de website{" "}
        <Link
          href={siteConfig.url}
          className="underline underline-offset-2 transition-opacity hover:opacity-60"
        >
          {siteConfig.url.replace(/^https?:\/\//, "")}
        </Link>
        . Zij zijn van toepassing op elke bestelling die wordt geplaatst door
        een consument in de zin van het Belgische Wetboek van economisch recht
        (WER).
      </LegalParagraph>

      <LegalSection title="1. Verkoper">
        <LegalList
          items={[
            <span key="name">
              <strong>{companyName}</strong>
              {legalForm ? ` (${legalForm})` : null}
            </span>,
            <span key="address">{getCompanyAddress("nl")}</span>,
            enterpriseNumber ? (
              <span key="bce">
                Ondernemingsnummer:{" "}
                {formatEnterpriseNumber(enterpriseNumber)}
              </span>
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
        <LegalParagraph>
          Openingsuren van de winkel: van maandag tot en met vrijdag, van 10 tot
          18 uur.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="2. Producten">
        <LegalParagraph>
          {companyName} verkoopt kleding, accessoires en artikelen in kasjmier
          en aanverwante materialen. De foto&apos;s en beschrijvingen op de
          website zijn zo getrouw mogelijk, maar de verkoper kan niet
          aansprakelijk worden gesteld voor lichte verschillen in kleur, textuur
          of afwerking die eigen zijn aan natuurlijke materialen.
        </LegalParagraph>
        <LegalParagraph>
          De producten worden aangeboden zolang de voorraad strekt. Indien een
          product na de bestelling niet beschikbaar blijkt, wordt de klant
          daarvan zo spoedig mogelijk op de hoogte gebracht en kan hij de
          annulering van zijn bestelling vragen, met terugbetaling van de
          betaalde bedragen.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="3. Prijzen">
        <LegalParagraph>
          De prijzen zijn vermeld in euro (€) en zijn, behoudens andersluidende
          vermelding, inclusief alle belastingen (incl. btw) voor Belgische
          consumenten. De eventuele leveringskosten worden vermeld vóór de
          definitieve bevestiging van de bestelling.
        </LegalParagraph>
        <LegalParagraph>
          {companyName} behoudt zich het recht voor zijn prijzen op elk ogenblik
          te wijzigen. De producten worden gefactureerd tegen de tarieven die
          gelden op het ogenblik van de bevestiging van de bestelling.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="4. Bestelling en totstandkoming van de overeenkomst">
        <LegalParagraph>
          Om online te bestellen, selecteert de klant de producten, voegt hij
          ze toe aan het winkelmandje en gaat hij over tot betaling via de
          beveiligde betaalpagina van Shopify. De bestelling is pas definitief
          na bevestiging van de betaling en ontvangst van de
          bestellingsbevestiging per e-mail.
        </LegalParagraph>
        <LegalParagraph>
          {companyName} behoudt zich het recht voor elke bestelling te weigeren
          of te annuleren in geval van een eerder geschil, een vermoeden van
          fraude of kennelijk onjuiste gegevens.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="5. Betaling">
        <LegalParagraph>
          De betaling gebeurt online via de betaalmiddelen die op de beveiligde
          betaalpagina worden aangeboden (bankkaarten en andere betaalmiddelen,
          afhankelijk van de opties van Shopify). In de winkel kan worden
          betaald volgens de in de winkel aanvaarde betaalwijzen.
        </LegalParagraph>
        <LegalParagraph>
          De betaalgegevens worden rechtstreeks verwerkt door de
          betaaldienstverlener; {companyName} bewaart geen volledige
          bankkaartgegevens.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="6. Levering en afhaling">
        <LegalList
          items={[
            "Levering in Europa: de leveringstermijnen en -kosten worden vermeld bij het plaatsen van de bestelling.",
            "Afhaling in de winkel: mogelijk op het hierboven vermelde adres, tijdens de openingsuren, na bevestiging dat de bestelde artikelen beschikbaar zijn.",
          ]}
        />
        <LegalParagraph>
          De leveringstermijnen worden ter informatie meegedeeld. Een redelijke
          vertraging kan geen aanleiding geven tot annulering van de bestelling
          of tot schadevergoeding, behalve bij een kennelijke overschrijding en
          na een ingebrekestelling die zonder gevolg is gebleven.
        </LegalParagraph>
        <LegalParagraph>
          De overdracht van het risico en van de eigendom vindt plaats bij de
          daadwerkelijke levering van de producten aan de klant of aan de
          vervoerder, volgens de toepasselijke voorwaarden.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="7. Herroepingsrecht">
        <LegalParagraph>
          Overeenkomstig boek VI van het Belgische Wetboek van economisch recht
          beschikt de consument over een termijn van 14 kalenderdagen vanaf de
          dag van ontvangst van de goederen om zijn herroepingsrecht uit te
          oefenen, zonder opgave van redenen en zonder kosten, met uitzondering
          van de kosten voor het terugzenden.
        </LegalParagraph>
        <LegalParagraph>
          Om dit recht uit te oefenen, moet de klant {companyName} vóór het
          verstrijken van de herroepingstermijn van zijn beslissing in kennis
          stellen, per e-mail aan{" "}
          <a
            href={`mailto:${email}`}
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            {email}
          </a>{" "}
          of per brief aan het adres van de verkoper.
        </LegalParagraph>
        <LegalParagraph>
          De producten moeten in hun oorspronkelijke staat worden teruggezonden,
          ongedragen, ongewassen, met hun labels en originele verpakking intact,
          binnen 14 dagen na de mededeling van de beslissing tot herroeping.{" "}
          {companyName} behoudt zich het recht voor de terugbetaling te weigeren
          indien de producten sporen van gebruik of beschadiging vertonen.
        </LegalParagraph>
        <LegalParagraph>
          De terugbetaling van de betaalde bedragen, met inbegrip van de
          eventuele oorspronkelijke kosten voor standaardlevering, gebeurt
          uiterlijk binnen 14 dagen na ontvangst van de teruggezonden producten
          of van het bewijs van verzending ervan, naargelang wat het eerst
          plaatsvindt, met hetzelfde betaalmiddel als het middel dat voor de
          bestelling werd gebruikt, tenzij anders overeengekomen.
        </LegalParagraph>
        <LegalParagraph>
          <strong>Uitzonderingen:</strong> overeenkomstig de wet geldt het
          herroepingsrecht onder meer niet voor goederen die volgens de
          specificaties van de consument zijn vervaardigd of duidelijk
          gepersonaliseerd zijn, noch voor goederen die snel kunnen bederven,
          noch voor goederen die na de levering werden ontzegeld en om redenen
          van hygiëne of gezondheidsbescherming niet kunnen worden
          teruggezonden.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="8. Wettelijke garanties">
        <LegalParagraph>
          Alle producten genieten de wettelijke garantie (conformiteitsgarantie)
          bepaald in boek VI van het Belgische Wetboek van economisch recht (2
          jaar vanaf de levering van het goed voor nieuwe goederen) en de
          vrijwaring voor verborgen gebreken overeenkomstig het Belgische
          Burgerlijk Wetboek.
        </LegalParagraph>
        <LegalParagraph>
          Bij een gebrek aan overeenstemming kan de consument het herstel of de
          vervanging van het goed vragen. Indien dat niet mogelijk of
          onevenredig is, kan hij een prijsvermindering of de ontbinding van de
          koop vragen, onder de door de wet bepaalde voorwaarden.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="9. Klachten en bemiddeling">
        <LegalParagraph>
          Voor elke klacht kunt u contact met ons opnemen via{" "}
          <a
            href={`mailto:${email}`}
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            {email}
          </a>{" "}
          of op het nummer{" "}
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            {phone}
          </a>
          . Wij verbinden ons ertoe zo spoedig mogelijk te antwoorden.
        </LegalParagraph>
        <LegalParagraph>
          Indien een geschil niet in der minne wordt opgelost, kan de consument
          zich kosteloos wenden tot de {mediation.name}:{" "}
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
          De consument kan ook gebruikmaken van het Europese platform voor
          onlinegeschillenbeslechting:{" "}
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

      <LegalSection title="10. Persoonsgegevens">
        <LegalParagraph>
          De gegevens die in het kader van bestellingen worden verzameld, worden
          verwerkt overeenkomstig ons{" "}
          <Link
            href={routes.privacy}
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            privacybeleid
          </Link>
          .
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="11. Toepasselijk recht en bevoegde rechtbank">
        <LegalParagraph>
          Op deze AVV is het Belgische recht van toepassing. In geval van een
          geschil, en bij gebrek aan een minnelijke oplossing of een geslaagde
          bemiddeling, worden de bevoegde rechtbanken bepaald overeenkomstig de
          toepasselijke wettelijke regels, waarbij de consument zich ook kan
          wenden tot de rechtbank van de plaats waar hij verblijft of van de
          plaats van de daadwerkelijke levering.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="12. Aanvaarding">
        <LegalParagraph>
          Het bevestigen van een online bestelling geldt als volledige en
          onvoorwaardelijke aanvaarding van deze AVV. {companyName} behoudt zich
          het recht voor de AVV op elk ogenblik te wijzigen; van toepassing
          zijn de voorwaarden die gelden op de datum van de bestelling.
        </LegalParagraph>
      </LegalSection>
    </LegalPage>
  );
}
