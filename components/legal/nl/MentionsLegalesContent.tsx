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
import Link from "@/components/LocaleLink";
import { routes } from "@/lib/routes";

/** The host's address as a Dutch text writes it. */
const HOSTING_ADDRESS =
  "440 N Barranca Avenue #4133, Covina, CA 91723, Verenigde Staten";

export default function MentionsLegalesContent() {
  const { companyName, hosting } = siteConfig.legal;
  const { email, phone } = siteConfig.contact;
  const { enterpriseNumber, vatNumber, legalForm } = getLegalIdentifiers();

  return (
    <LegalPage
      title="Wettelijke vermeldingen"
      locale="nl"
      lastUpdated={legalLastUpdated}
    >
      <LegalSection title="Uitgever van de website">
        <LegalParagraph>
          Deze website{" "}
          <Link
            href={siteConfig.url}
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            {siteConfig.url.replace(/^https?:\/\//, "")}
          </Link>{" "}
          wordt uitgegeven door:
        </LegalParagraph>
        <LegalList
          items={[
            <span key="name">
              <strong>{companyName}</strong>
              {legalForm ? ` (${legalForm})` : null}
            </span>,
            <span key="address">
              Zetel en adres: {getCompanyAddress("nl")}
            </span>,
            enterpriseNumber ? (
              <span key="bce">
                Ondernemingsnummer (KBO):{" "}
                {formatEnterpriseNumber(enterpriseNumber)}
              </span>
            ) : (
              <span key="bce">
                Ondernemingsnummer (KBO): op verzoek verkrijgbaar via{" "}
                <a
                  href={`mailto:${email}`}
                  className="underline underline-offset-2 transition-opacity hover:opacity-60"
                >
                  {email}
                </a>
              </span>
            ),
            vatNumber ? (
              <span key="vat">Btw-nummer: {vatNumber}</span>
            ) : null,
            <span key="phone">
              Telefoon:{" "}
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="underline underline-offset-2 transition-opacity hover:opacity-60"
              >
                {phone}
              </a>
            </span>,
            <span key="email">
              E-mail:{" "}
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

      <LegalSection title="Activiteit">
        <LegalParagraph>
          {companyName} is een winkel gespecialiseerd in de verkoop van kleding,
          accessoires en artikelen in kasjmier, in de winkel in Ukkel (Brussel)
          en online via deze website.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Hosting">
        <LegalParagraph>
          De website wordt gehost door {hosting.provider}, {HOSTING_ADDRESS}.
          Website:{" "}
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

      <LegalSection title="Intellectuele eigendom">
        <LegalParagraph>
          Alle elementen van de website (teksten, foto&apos;s, illustraties,
          logo&apos;s, video&apos;s, lay-out, huisstijl enz.) zijn beschermd
          door het auteursrecht en het merkenrecht. Elke volledige of
          gedeeltelijke reproductie, weergave, wijziging of exploitatie zonder
          voorafgaande schriftelijke toestemming van {companyName} is verboden.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Aansprakelijkheid">
        <LegalParagraph>
          {companyName} streeft ernaar de juistheid en actualiteit van de op
          deze website verspreide informatie te verzekeren. {companyName} kan
          echter niet instaan voor de juistheid, nauwkeurigheid of volledigheid
          van de ter beschikking gestelde informatie. Het gebruik van de
          website gebeurt uitsluitend op eigen verantwoordelijkheid van de
          gebruiker.
        </LegalParagraph>
        <LegalParagraph>
          De website kan links naar websites van derden bevatten.{" "}
          {companyName} heeft geen enkele controle over deze websites en wijst
          elke aansprakelijkheid voor de inhoud ervan af.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Persoonsgegevens en cookies">
        <LegalParagraph>
          Voor alle informatie over de verwerking van uw persoonsgegevens
          verwijzen wij naar ons{" "}
          <Link
            href={routes.privacy}
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            privacybeleid
          </Link>
          . Voor de cookies die op deze website worden gebruikt, verwijzen wij
          naar ons{" "}
          <Link
            href={routes.cookies}
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            cookiebeleid
          </Link>
          .
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Toepasselijk recht">
        <LegalParagraph>
          Op deze website is het Belgische recht van toepassing. In geval van
          een geschil, en bij gebrek aan een minnelijke oplossing, zijn
          uitsluitend de bevoegde rechtbanken van het gerechtelijk arrondissement
          Brussel bevoegd, onder voorbehoud van de dwingende wettelijke
          bepalingen die van toepassing zijn op consumenten.
        </LegalParagraph>
      </LegalSection>
    </LegalPage>
  );
}
