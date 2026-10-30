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

/** siteConfig.legal.hosting.address ends in French ("États-Unis"). */
const HOSTING_ADDRESS =
  "440 N Barranca Avenue #4133, Covina, CA 91723, United States";

export default function MentionsLegalesContent() {
  const { companyName, hosting } = siteConfig.legal;
  const { email, phone } = siteConfig.contact;
  const { enterpriseNumber, vatNumber, legalForm } = getLegalIdentifiers();

  return (
    <LegalPage
      title="Legal notice"
      locale="en"
      lastUpdated={legalLastUpdated}
    >
      <LegalSection title="Website publisher">
        <LegalParagraph>
          This website{" "}
          <Link
            href={siteConfig.url}
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            {siteConfig.url.replace(/^https?:\/\//, "")}
          </Link>{" "}
          is published by:
        </LegalParagraph>
        <LegalList
          items={[
            <span key="name">
              <strong>{companyName}</strong>
              {legalForm ? ` (${legalForm})` : null}
            </span>,
            <span key="address">
              Registered office and address: {getCompanyAddress("en")}
            </span>,
            enterpriseNumber ? (
              <span key="bce">
                Enterprise number (CBE):{" "}
                {formatEnterpriseNumber(enterpriseNumber)}
              </span>
            ) : (
              <span key="bce">
                Enterprise number (CBE): available on request from{" "}
                <a
                  href={`mailto:${email}`}
                  className="underline underline-offset-2 transition-opacity hover:opacity-60"
                >
                  {email}
                </a>
              </span>
            ),
            vatNumber ? (
              <span key="vat">VAT number: {vatNumber}</span>
            ) : null,
            <span key="phone">
              Telephone:{" "}
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="underline underline-offset-2 transition-opacity hover:opacity-60"
              >
                {phone}
              </a>
            </span>,
            <span key="email">
              Email:{" "}
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

      <LegalSection title="Business activity">
        <LegalParagraph>
          {companyName} is a boutique specialising in the sale of clothing,
          accessories and articles made of cashmere, in its shop in Uccle
          (Brussels) and online via this website.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Hosting">
        <LegalParagraph>
          The website is hosted by {hosting.provider}, {HOSTING_ADDRESS}.
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

      <LegalSection title="Intellectual property">
        <LegalParagraph>
          All the elements making up the website (texts, photographs,
          illustrations, logos, videos, layout, visual identity, etc.) are
          protected by copyright and trade mark law. Any reproduction,
          representation, modification or exploitation, in whole or in part,
          without the prior written authorisation of {companyName} is
          prohibited.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Liability">
        <LegalParagraph>
          {companyName} endeavours to ensure that the information published on
          this website is accurate and up to date. However, it cannot guarantee
          the accuracy, precision or completeness of the information made
          available. Use of the website is at the user&apos;s sole risk.
        </LegalParagraph>
        <LegalParagraph>
          The website may contain links to third-party websites. {companyName}{" "}
          has no control over these websites and accepts no liability for their
          content.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Personal data and cookies">
        <LegalParagraph>
          For any information about the processing of your personal data,
          please see our{" "}
          <Link
            href={routes.privacy}
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            privacy policy
          </Link>
          . For the cookies used on this website, please see our{" "}
          <Link
            href={routes.cookies}
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            cookie policy
          </Link>
          .
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Governing law">
        <LegalParagraph>
          This website is governed by Belgian law. In the event of a dispute,
          and failing an amicable settlement, the competent courts of the
          judicial district of Brussels shall have exclusive jurisdiction,
          subject to the mandatory statutory provisions applicable to
          consumers.
        </LegalParagraph>
      </LegalSection>
    </LegalPage>
  );
}
