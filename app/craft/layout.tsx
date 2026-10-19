import React from "react";
import { Metadata } from "next";

import { PORTFOLIO_URL } from "@/lib/constants";
import { socialMetadata } from "@/lib/metadata";

const title = "Crafts | Aviral";
const description =
  "UI experiments, animations, and interactive demos built as a frontend engineer.";

export const metadata: Metadata = {
  title,
  description,
  ...socialMetadata({ title, description, path: "/craft" }),
  alternates: {
    canonical: `${PORTFOLIO_URL}/craft`,
    types: { "text/markdown": `${PORTFOLIO_URL}/craft.md` },
  },
};

export default function CraftsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
