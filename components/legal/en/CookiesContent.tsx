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
    <LegalPage title="Cookies" locale="en" lastUpdated={legalLastUpdated}>
      <LegalParagraph>
        This policy explains how {companyName} uses cookies and similar
        technologies on the website{" "}
        <Link
          href={siteConfig.url}
          className="underline underline-offset-2 transition-opacity hover:opacity-60"
        >
          {siteConfig.url.replace(/^https?:\/\//, "")}
        </Link>
        , in accordance with the Belgian Law of 13 June 2005 on electronic
        communications and Regulation (EU) 2016/679 (GDPR).
      </LegalParagraph>

      <LegalSection title="1. What is a cookie?">
        <LegalParagraph>
          A cookie is a small text file placed on your device (computer, tablet,
          smartphone) when you visit a website. It allows the website to
          remember certain information for a limited period.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="2. Cookies used on this website">
        <LegalParagraph>
          We use only cookies that are strictly necessary for the website to
          function and to provide the services you request. To date, no
          third-party advertising or audience measurement cookies are used on
          this website.
        </LegalParagraph>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-lg border-collapse text-left font-serif text-sm text-black/80 md:text-base">
            <thead>
              <tr className="border-b border-black/20">
                <th className="py-3 pr-4 font-serif uppercase tracking-wide text-xs text-black/50">
                  Cookie
                </th>
                <th className="py-3 pr-4 font-serif uppercase tracking-wide text-xs text-black/50">
                  Purpose
                </th>
                <th className="py-3 pr-4 font-serif uppercase tracking-wide text-xs text-black/50">
                  Duration
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
                  Remembering your shopping basket
                </td>
                <td className="py-3 pr-4 align-top">14 days</td>
                <td className="py-3 align-top">Strictly necessary</td>
              </tr>
              <tr className="border-b border-black/10">
                <td className="py-3 pr-4 align-top">
                  shopify_customer_session
                </td>
                <td className="py-3 pr-4 align-top">
                  Keeping you signed in to your customer account
                </td>
                <td className="py-3 pr-4 align-top">Session</td>
                <td className="py-3 align-top">Strictly necessary</td>
              </tr>
              <tr className="border-b border-black/10">
                <td className="py-3 pr-4 align-top">
                  shopify_oauth_state, shopify_oauth_nonce,
                  shopify_oauth_code_verifier, shopify_oauth_return_to
                </td>
                <td className="py-3 pr-4 align-top">
                  Securing sign-in to your customer account
                </td>
                <td className="py-3 pr-4 align-top">10 minutes</td>
                <td className="py-3 align-top">Strictly necessary</td>
              </tr>
            </tbody>
          </table>
        </div>

        <LegalParagraph>
          At checkout, you are redirected to Shopify&apos;s secure payment page,
          which may place its own cookies needed to process the transaction.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="3. Legal basis">
        <LegalParagraph>
          Strictly necessary cookies are placed on the basis of the legitimate
          interest of {companyName} and/or the need to perform the contract
          (managing the basket, signing in to your account, completing an
          order), in accordance with the applicable regulations. They do not
          require your prior consent.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="4. Managing cookies">
        <LegalParagraph>
          You can set your browser to refuse all or some cookies, or to warn
          you before they are placed. The procedure varies from browser to
          browser:
        </LegalParagraph>
        <LegalList
          items={[
            <span key="chrome">
              Chrome: Settings → Privacy and security → Cookies
            </span>,
            <span key="firefox">
              Firefox: Settings → Privacy &amp; Security → Cookies
            </span>,
            <span key="safari">Safari: Settings → Privacy → Cookies</span>,
            <span key="edge">
              Edge: Settings → Cookies and site permissions
            </span>,
          ]}
        />
        <LegalParagraph>
          Refusing strictly necessary cookies may prevent you from using certain
          features of the website, in particular adding items to your basket or
          signing in to your account.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="5. Personal data">
        <LegalParagraph>
          To find out more about how your personal data are processed, please
          see our{" "}
          <Link
            href={routes.privacy}
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            privacy policy
          </Link>
          .
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="6. Contact">
        <LegalParagraph>
          For any question about cookies, please contact us at{" "}
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
