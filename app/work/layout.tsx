import React from "react";
import { Metadata } from "next";

import { PORTFOLIO_URL } from "@/lib/constants";
import { socialMetadata } from "@/lib/metadata";

const title = "Work | Aviral";
const description =
  "Explore my work experience, showcasing impactful contributions and skills I have demonstrated.";

export const metadata: Metadata = {
  title,
  description,
  ...socialMetadata({ title, description, path: "/work" }),
  alternates: {
    canonical: `${PORTFOLIO_URL}/work`,
    types: { "text/markdown": `${PORTFOLIO_URL}/work.md` },
  },
};

export default function WorkLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
