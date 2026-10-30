import LegalPage, {
  LegalList,
  LegalParagraph,
  LegalSection,
} from "@/components/LegalPage";
import { legalLastUpdated } from "@/lib/legal";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site";
import Link from "@/components/LocaleLink";

export default function CookiesContent() {
  const { companyName } = siteConfig.legal;
  const { email } = siteConfig.contact;

  return (
    <LegalPage title="Cookies" locale="nl" lastUpdated={legalLastUpdated}>
      <LegalParagraph>
        Dit beleid legt uit hoe {companyName} cookies en soortgelijke
        technologieën gebruikt op de website{" "}
        <Link
          href={siteConfig.url}
          className="underline underline-offset-2 transition-opacity hover:opacity-60"
        >
          {siteConfig.url.replace(/^https?:\/\//, "")}
        </Link>
        , overeenkomstig de Belgische wet van 13 juni 2005 betreffende de
        elektronische communicatie en Verordening (EU) 2016/679 (AVG).
      </LegalParagraph>

      <LegalSection title="1. Wat is een cookie?">
        <LegalParagraph>
          Een cookie is een klein tekstbestand dat op uw toestel (computer,
          tablet, smartphone) wordt geplaatst wanneer u een website bezoekt.
          Hiermee kan de website bepaalde informatie gedurende een beperkte tijd
          onthouden.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="2. Cookies die op deze website worden gebruikt">
        <LegalParagraph>
          Wij gebruiken uitsluitend cookies die strikt noodzakelijk zijn voor
          de werking van de website en voor het leveren van de diensten die u
          vraagt. Op dit ogenblik worden op deze website geen advertentiecookies
          of cookies van derden voor bezoekersmeting gebruikt.
        </LegalParagraph>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-lg border-collapse text-left font-serif text-sm text-black/80 md:text-base">
            <thead>
              <tr className="border-b border-black/20">
                <th className="py-3 pr-4 font-serif uppercase tracking-wide text-xs text-black/50">
                  Cookie
                </th>
                <th className="py-3 pr-4 font-serif uppercase tracking-wide text-xs text-black/50">
                  Doel
                </th>
                <th className="py-3 pr-4 font-serif uppercase tracking-wide text-xs text-black/50">
                  Duur
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
                  Onthouden van uw winkelmandje
                </td>
                <td className="py-3 pr-4 align-top">14 dagen</td>
                <td className="py-3 align-top">Strikt noodzakelijk</td>
              </tr>
              <tr className="border-b border-black/10">
                <td className="py-3 pr-4 align-top">
                  shopify_customer_session
                </td>
                <td className="py-3 pr-4 align-top">
                  Behouden van de sessie van uw klantaccount
                </td>
                <td className="py-3 pr-4 align-top">Sessie</td>
                <td className="py-3 align-top">Strikt noodzakelijk</td>
              </tr>
              <tr className="border-b border-black/10">
                <td className="py-3 pr-4 align-top">
                  shopify_oauth_state, shopify_oauth_nonce,
                  shopify_oauth_code_verifier, shopify_oauth_return_to
                </td>
                <td className="py-3 pr-4 align-top">
                  Beveiligen van het aanmelden bij uw klantaccount
                </td>
                <td className="py-3 pr-4 align-top">10 minuten</td>
                <td className="py-3 align-top">Strikt noodzakelijk</td>
              </tr>
            </tbody>
          </table>
        </div>

        <LegalParagraph>
          Bij de betaling wordt u doorgestuurd naar de beveiligde betaalpagina
          van Shopify, die eigen cookies kan plaatsen die nodig zijn voor de
          verwerking van de transactie.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="3. Rechtsgrond">
        <LegalParagraph>
          De strikt noodzakelijke cookies worden geplaatst op grond van het
          gerechtvaardigd belang van {companyName} en/of de noodzaak om de
          overeenkomst uit te voeren (beheer van het winkelmandje, aanmelding
          bij het account, afronding van de bestelling), overeenkomstig de
          toepasselijke regelgeving. Hiervoor is uw voorafgaande toestemming
          niet vereist.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="4. Beheer van cookies">
        <LegalParagraph>
          U kunt uw browser zo instellen dat hij alle of bepaalde cookies
          weigert, of dat u wordt gewaarschuwd voordat ze worden geplaatst. De
          werkwijze verschilt van browser tot browser:
        </LegalParagraph>
        <LegalList
          items={[
            <span key="chrome">
              Chrome: Instellingen → Privacy en beveiliging → Cookies
            </span>,
            <span key="firefox">
              Firefox: Instellingen → Privacy &amp; Beveiliging → Cookies
            </span>,
            <span key="safari">
              Safari: Instellingen → Privacy → Cookies
            </span>,
            <span key="edge">
              Edge: Instellingen → Cookies en sitemachtigingen
            </span>,
          ]}
        />
        <LegalParagraph>
          Het weigeren van strikt noodzakelijke cookies kan het gebruik van
          bepaalde functies van de website verhinderen, met name het toevoegen
          van artikelen aan het winkelmandje of het aanmelden bij uw account.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="5. Persoonsgegevens">
        <LegalParagraph>
          Meer informatie over de verwerking van uw persoonsgegevens vindt u in
          ons{" "}
          <Link
            href={routes.privacy}
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            privacybeleid
          </Link>
          .
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="6. Contact">
        <LegalParagraph>
          Voor elke vraag over cookies kunt u contact met ons opnemen via{" "}
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
