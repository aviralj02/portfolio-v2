import type { Metadata } from "next";
import { PORTFOLIO_DESC, PORTFOLIO_URL } from "./constants";

export const portfolioMetadata: Metadata = {
  metadataBase: new URL(PORTFOLIO_URL),
  title: "Aviral | Portfolio",
  description: PORTFOLIO_DESC,

  keywords: [
    "Aviral Jain",
    "Portfolio",
    "Next.js",
    "React.js",
    "Developer",
    "Engineer",
  ],
  openGraph: {
    url: PORTFOLIO_URL,
    siteName: "Aviral Jain",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: "index, follow",
  },
  applicationName: "Aviral | Portfolio",
  alternates: {
    canonical: PORTFOLIO_URL,
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
      {
        url: "/favicon-48x48.png",
        sizes: "48x48",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};
