import type { Metadata } from "next";

import { PORTFOLIO_DESC, PORTFOLIO_URL } from "./constants";

const OPEN_GRAPH_BASE = {
  siteName: "Aviral Jain",
  type: "website",
  locale: "en_US",
} as const;

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
    title: "Aviral Jain",
    description: PORTFOLIO_DESC,
    url: PORTFOLIO_URL,
    ...OPEN_GRAPH_BASE,
    images: [
      {
        url: `${PORTFOLIO_URL}/opengraph-image.jpg`,
        width: 2400,
        height: 1260,
        alt: "Aviral Jain – Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aviral | Portfolio",
    description: PORTFOLIO_DESC,
    images: [`${PORTFOLIO_URL}/twitter-image.jpg`],
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
    /* The Markdown sibling of the home page, per the llms.txt convention of
       appending the extension to a URL that has no filename. */
    types: { "text/markdown": `${PORTFOLIO_URL}/index.md` },
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

/**
 * Child segments that set `openGraph` or `twitter` replace the root's objects
 * wholesale, and ones that set neither inherit the home page's title and URL.
 * Images are left out on purpose: each segment's `opengraph-image` and
 * `twitter-image` files supply them.
 */
export const socialMetadata = ({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Pick<Metadata, "openGraph" | "twitter"> => ({
  openGraph: {
    ...OPEN_GRAPH_BASE,
    title,
    description,
    url: `${PORTFOLIO_URL}${path}`,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
});
