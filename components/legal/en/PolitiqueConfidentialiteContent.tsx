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

/** Official English site of the Belgian Data Protection Authority. */
const DPA_WEBSITE = "https://www.dataprotectionauthority.be";

export default function PolitiqueConfidentialiteContent() {
  const { companyName } = siteConfig.legal;
  const { email, phone } = siteConfig.contact;
  const { enterpriseNumber, vatNumber } = getLegalIdentifiers();

  return (
    <LegalPage
      title="Privacy policy"
      locale="en"
      lastUpdated={legalLastUpdated}
    >
      <LegalParagraph>
        This privacy policy describes how {companyName} collects, uses and
        protects your personal data in accordance with Regulation (EU)
        2016/679 (GDPR) and the Belgian Law of 30 July 2018 on the protection
        of natural persons with regard to the processing of personal data.
      </LegalParagraph>

      <LegalSection title="1. Data controller">
        <LegalList
          items={[
            <span key="name">
              <strong>{companyName}</strong>
            </span>,
            <span key="address">{getCompanyAddress("en")}</span>,
            enterpriseNumber ? (
              <span key="bce">Enterprise number: {enterpriseNumber}</span>
            ) : null,
            vatNumber ? (
              <span key="vat">VAT number: {vatNumber}</span>
            ) : null,
            <span key="email">
              Email:{" "}
              <a
                href={`mailto:${email}`}
                className="underline underline-offset-2 transition-opacity hover:opacity-60"
              >
                {email}
              </a>
            </span>,
            <span key="phone">
              Telephone:{" "}
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

      <LegalSection title="2. Data collected">
        <LegalParagraph>
          Depending on your interactions with our website and our shop, we may
          process the following categories of data:
        </LegalParagraph>
        <LegalList
          items={[
            "Identification and contact data: surname, first name, email address, telephone number, postal address.",
            "Order data: products purchased, amounts, order history, delivery and billing information.",
            "Customer account data: login credentials and preferences linked to your account, where applicable.",
            "Communication data: the content of messages sent via our contact form or by email.",
            "Technical data: IP address, browser type, pages visited, cookies (see our cookie policy).",
          ]}
        />
      </LegalSection>

      <LegalSection title="3. Purposes and legal bases">
        <LegalList
          items={[
            "Managing orders, delivery and after-sales service (performance of the contract).",
            "Creating and managing your customer account (performance of the contract or pre-contractual measures).",
            "Responding to your contact requests (legitimate interest or pre-contractual measures).",
            "Complying with our legal and accounting obligations (legal obligation).",
            "Improving the website, security and fraud prevention (legitimate interest).",
            "Sending marketing communications, only with your consent where the law requires it.",
          ]}
        />
      </LegalSection>

      <LegalSection title="4. Recipients of the data">
        <LegalParagraph>
          Your data may be disclosed to the following recipients, to the extent
          necessary for their tasks:
        </LegalParagraph>
        <LegalList
          items={[
            "Shopify International Limited and its subsidiaries, for processing online orders and payments, managing customer accounts and hosting the online shop.",
            "Vercel Inc., for the technical hosting of the website.",
            "Resend, for sending messages submitted through the contact form.",
            "Sanity.io, for the editorial management of the journal content.",
            "Delivery and payment service providers involved in fulfilling your order.",
            "Administrative or judicial authorities, where required by law.",
          ]}
        />
        <LegalParagraph>
          Some of these service providers may be located outside the European
          Economic Area. In that case, appropriate safeguards are put in place
          in accordance with the GDPR (standard contractual clauses, adequacy
          decisions or other recognised mechanisms).
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="5. Retention periods">
        <LegalList
          items={[
            "Order and billing data: kept for the statutory period applicable to accounting and tax matters (generally 7 years in Belgium).",
            "Customer account data: kept for as long as the account is active, then archived or deleted in accordance with our legal obligations.",
            "Contact data: kept for as long as necessary to deal with your request, then archived if a dispute is possible.",
            "Technical data and cookies: for the periods stated in our cookie policy.",
          ]}
        />
      </LegalSection>

      <LegalSection title="6. Your rights">
        <LegalParagraph>
          Under the GDPR, you have the following rights regarding your personal
          data:
        </LegalParagraph>
        <LegalList
          items={[
            "The right of access and rectification.",
            "The right to erasure, within the limits laid down by law.",
            "The right to restriction of processing.",
            "The right to object, in particular to processing based on legitimate interest.",
            "The right to portability of the data you have provided to us, where the processing is automated and based on the contract or on consent.",
            "The right to withdraw your consent at any time, without affecting the lawfulness of processing carried out before its withdrawal.",
          ]}
        />
        <LegalParagraph>
          To exercise your rights, please contact us at{" "}
          <a
            href={`mailto:${email}`}
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            {email}
          </a>
          . We may ask you for proof of identity. You also have the right to
          lodge a complaint with the Data Protection Authority (DPA):{" "}
          <a
            href={DPA_WEBSITE}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            {DPA_WEBSITE.replace(/^https?:\/\//, "")}
          </a>
          .
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="7. Security">
        <LegalParagraph>
          We implement appropriate technical and organisational measures to
          protect your data against accidental or unlawful destruction, loss,
          alteration, disclosure or unauthorised access.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="8. Cookies">
        <LegalParagraph>
          For more information on the use of cookies, please see our{" "}
          <Link
            href={routes.cookies}
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            cookie policy
          </Link>
          .
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="9. Changes">
        <LegalParagraph>
          We may amend this policy at any time. The version in force is the one
          published on this page, showing the date it was last updated.
        </LegalParagraph>
      </LegalSection>
    </LegalPage>
  );
}
