import type { Metadata } from "next";
import CookieConsent from "@/components/CookieConsent";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import OrganizationJsonLd from "@/components/OrganizationJsonLd";
import SmoothScroll from "@/components/SmoothScroll";
import { rootMetadata } from "@/lib/seo";
import { ivyPrestoHeadline, neueHaasDisplay } from "./fonts";
import "./globals.css";

export const metadata: Metadata = rootMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${neueHaasDisplay.variable} ${ivyPrestoHeadline.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans font-light">
        <OrganizationJsonLd />
        <SmoothScroll>
          <Navbar />
          {children}
          <Footer />
        </SmoothScroll>
        <CookieConsent />
      </body>
    </html>
  );
}
