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
    title: "Aviral | Portfolio",
    description: PORTFOLIO_DESC,
    url: PORTFOLIO_URL,
    siteName: "Aviral Jain",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://www.aviral.xyz/opengraph-image.jpg",
      },
      {
        url: "https://www.aviral.xyz/twitter-image.jpg",
      },
    ],
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
