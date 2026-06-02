import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Analytics } from "@vercel/analytics/react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PORTFOLIO_DESC, PORTFOLIO_URL } from "@/lib/constants";
import { portfolioMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = portfolioMetadata;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${PORTFOLIO_URL}/#person`,
      name: "Aviral Jain",
      url: PORTFOLIO_URL,
      description: PORTFOLIO_DESC,
      jobTitle: "Full Stack Engineer",
      sameAs: [
        "https://github.com/aviralj02",
        "https://linkedin.com/in/aviraljain02",
      ],
      image: {
        "@type": "ImageObject",
        url: `${PORTFOLIO_URL}/opengraph-image.jpg`,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${PORTFOLIO_URL}/#website`,
      url: PORTFOLIO_URL,
      name: "Aviral Jain",
      description: PORTFOLIO_DESC,
      publisher: { "@id": `${PORTFOLIO_URL}/#person` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={cn(
          inter.className,
          "bg-background text-primary scrollbar antialiased overflow-x-hidden h-screen grid grid-rows-[auto_1fr_auto]",
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Header />

          {children}

          <Footer />
        </ThemeProvider>

        <Analytics />
      </body>
    </html>
  );
}
