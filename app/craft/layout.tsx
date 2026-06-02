import React from "react";
import { Metadata } from "next";

import { PORTFOLIO_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Crafts | Aviral",
  description:
    "UI experiments, animations, and interactive demos built as a frontend engineer.",
  alternates: { canonical: `${PORTFOLIO_URL}/craft` },
};

export default function CraftsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
