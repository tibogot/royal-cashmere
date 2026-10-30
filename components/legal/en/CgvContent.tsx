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

/** Official English page of the Belgian Consumer Mediation Service. */
const MEDIATION_WEBSITE = "https://www.consumerombudsman.be/en";

export default function CgvContent() {
  const { companyName, mediation } = siteConfig.legal;
  const { email, phone } = siteConfig.contact;
  const { enterpriseNumber, vatNumber, legalForm } = getLegalIdentifiers();

  return (
    <LegalPage
      title="Terms and conditions"
      locale="en"
      lastUpdated={legalLastUpdated}
    >
      <LegalParagraph>
        These Terms and Conditions of Sale (hereinafter the &ldquo;Terms&rdquo;)
        govern the sale of products by {companyName}, both in store and at a
        distance via the website{" "}
        <Link
          href={siteConfig.url}
          className="underline underline-offset-2 transition-opacity hover:opacity-60"
        >
          {siteConfig.url.replace(/^https?:\/\//, "")}
        </Link>
        . They apply to every order placed by a consumer within the meaning of
        the Belgian Code of Economic Law.
      </LegalParagraph>

      <LegalSection title="1. Seller">
        <LegalList
          items={[
            <span key="name">
              <strong>{companyName}</strong>
              {legalForm ? ` (${legalForm})` : null}
            </span>,
            <span key="address">{getCompanyAddress("en")}</span>,
            enterpriseNumber ? (
              <span key="bce">
                Enterprise number: {formatEnterpriseNumber(enterpriseNumber)}
              </span>
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
        <LegalParagraph>
          Shop opening hours: Monday to Friday, 10 a.m. to 6 p.m.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="2. Products">
        <LegalParagraph>
          {companyName} sells clothing, accessories and articles made of
          cashmere and related materials. The photographs and descriptions
          shown on the website are as faithful as possible, but the seller
          cannot be held liable for slight differences in shade, texture or
          finish that are inherent in natural materials.
        </LegalParagraph>
        <LegalParagraph>
          Products are offered while stocks last. Should a product prove
          unavailable after an order has been placed, the customer will be
          informed as soon as possible and may request the cancellation of the
          order and a refund of the sums paid.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="3. Prices">
        <LegalParagraph>
          Prices are stated in euros (€) and, unless otherwise indicated, are
          inclusive of all taxes (including VAT) for Belgian consumers. Any
          delivery charges are shown before the order is finally confirmed.
        </LegalParagraph>
        <LegalParagraph>
          {companyName} reserves the right to change its prices at any time.
          Products are invoiced at the prices in force at the time the order is
          confirmed.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="4. Ordering and conclusion of the contract">
        <LegalParagraph>
          To order online, the customer selects the products, adds them to the
          basket and then proceeds to payment via the secure Shopify checkout
          page. The order becomes final only once payment has been confirmed
          and the order confirmation email has been received.
        </LegalParagraph>
        <LegalParagraph>
          {companyName} reserves the right to refuse or cancel any order in the
          event of a prior dispute, suspected fraud or clearly incorrect
          information.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="5. Payment">
        <LegalParagraph>
          Online payment is made using the payment methods offered on the
          secure checkout page (bank cards and other methods available
          according to the Shopify options). In store, payment may be made by
          the methods accepted in the shop.
        </LegalParagraph>
        <LegalParagraph>
          Payment data are processed directly by the payment service provider;{" "}
          {companyName} does not store full bank card details.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="6. Delivery and collection">
        <LegalList
          items={[
            "Delivery within Europe: delivery times and charges are shown when the order is placed.",
            "Collection in store: available at the address given above, during opening hours, once the availability of the ordered items has been confirmed.",
          ]}
        />
        <LegalParagraph>
          Delivery times are given for guidance only. A reasonable delay cannot
          give rise to the cancellation of the order or to damages, except
          where the delivery time is manifestly exceeded and a formal notice
          has gone unheeded.
        </LegalParagraph>
        <LegalParagraph>
          Risk and ownership pass upon actual delivery of the products to the
          customer or to the carrier, in accordance with the applicable
          conditions.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="7. Right of withdrawal">
        <LegalParagraph>
          In accordance with Book VI of the Belgian Code of Economic Law, the
          consumer has a period of 14 calendar days from the day of receipt of
          the goods in which to exercise the right of withdrawal, without
          having to give any reason and without incurring any costs other than
          the cost of returning the goods.
        </LegalParagraph>
        <LegalParagraph>
          To exercise this right, the customer must notify {companyName} of
          their decision by email to{" "}
          <a
            href={`mailto:${email}`}
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            {email}
          </a>{" "}
          or by post to the seller&apos;s address, before the withdrawal period
          expires.
        </LegalParagraph>
        <LegalParagraph>
          The products must be returned in their original condition, unworn,
          unwashed, with their original labels and packaging intact, within 14
          days of the decision to withdraw being communicated. {companyName}{" "}
          reserves the right to refuse a refund if the products show signs of
          use or damage.
        </LegalParagraph>
        <LegalParagraph>
          The sums paid, including the initial standard delivery charges where
          applicable, will be refunded no later than 14 days after receipt of
          the returned products or of proof that they have been sent back,
          whichever is earlier, using the same means of payment as was used for
          the order, unless otherwise agreed.
        </LegalParagraph>
        <LegalParagraph>
          <strong>Exceptions:</strong> in accordance with the law, the right of
          withdrawal does not apply, in particular, to goods made to the
          consumer&apos;s specifications or clearly personalised, nor to goods
          liable to deteriorate rapidly, nor to goods that have been unsealed
          after delivery and cannot be returned for reasons of hygiene or
          health protection.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="8. Legal guarantees">
        <LegalParagraph>
          All products are covered by the legal guarantee of conformity
          provided for in Book VI of the Belgian Code of Economic Law (2 years
          from delivery of the goods, for new goods) and by the guarantee
          against latent defects under the Belgian Civil Code.
        </LegalParagraph>
        <LegalParagraph>
          In the event of a lack of conformity, the consumer may request that
          the goods be repaired or replaced. If this is impossible or
          disproportionate, the consumer may request a price reduction or the
          termination of the sale, under the conditions laid down by law.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="9. Complaints and mediation">
        <LegalParagraph>
          For any complaint, please contact us at{" "}
          <a
            href={`mailto:${email}`}
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            {email}
          </a>{" "}
          or on{" "}
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            {phone}
          </a>
          . We undertake to reply as soon as possible.
        </LegalParagraph>
        <LegalParagraph>
          If a dispute cannot be resolved amicably, the consumer may refer it
          free of charge to the Consumer Mediation Service:{" "}
          <a
            href={MEDIATION_WEBSITE}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            {MEDIATION_WEBSITE.replace(/^https?:\/\//, "")}
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
          The consumer may also use the European online dispute resolution
          platform:{" "}
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

      <LegalSection title="10. Personal data">
        <LegalParagraph>
          Data collected in connection with orders are processed in accordance
          with our{" "}
          <Link
            href={routes.privacy}
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            privacy policy
          </Link>
          .
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="11. Governing law and jurisdiction">
        <LegalParagraph>
          These Terms are governed by Belgian law. In the event of a dispute,
          and failing an amicable settlement or successful mediation, the
          competent courts will be determined in accordance with the applicable
          statutory rules; the consumer may also bring proceedings before the
          court of the place where they reside or of the place of actual
          delivery.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="12. Acceptance">
        <LegalParagraph>
          Confirming an online order constitutes full and unreserved acceptance
          of these Terms. {companyName} reserves the right to amend the Terms at
          any time; the applicable conditions are those in force on the date of
          the order.
        </LegalParagraph>
      </LegalSection>
    </LegalPage>
  );
}
