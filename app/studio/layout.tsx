import { NextStudioLayout } from "next-sanity/studio";

/**
 * Root layout for the Studio branch. The site's own root layout lives in
 * `app/(site)/layout.tsx`, so the Studio gets its own `<html>`/`<body>` and
 * none of the site's Navbar, Footer, fonts or Tailwind base.
 */
export const metadata = {
  title: "Royal Cashmere Studio",
};

export default function StudioRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <NextStudioLayout>{children}</NextStudioLayout>
      </body>
    </html>
  );
}
