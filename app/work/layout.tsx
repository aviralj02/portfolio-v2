import React from "react";
import { Metadata } from "next";

import { PORTFOLIO_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Work | Aviral",
  description:
    "Explore my work experience, showcasing impactful contributions and skills I have demonstrated.",
  alternates: { canonical: `${PORTFOLIO_URL}/work` },
};

export default function WorkLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
