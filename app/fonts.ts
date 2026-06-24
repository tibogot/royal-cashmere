import localFont from "next/font/local";

export const neueHaasDisplay = localFont({
  src: [
    {
      path: "./fonts/NeueHaasDisplay-Light.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/NeueHaasDisplay-Roman.woff",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-neue-haas",
  display: "swap",
});

export const ivyPrestoHeadline = localFont({
  src: "./fonts/ivy-presto-headline-light.otf",
  variable: "--font-ivy-presto",
  weight: "300",
  display: "swap",
});
