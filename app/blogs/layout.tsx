import React from "react";
import { Metadata } from "next";

import { PORTFOLIO_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Blogs | Aviral",
  description:
    "I write insightful blogs sharing my thoughts on tech trends, development, and the tools I use.",
  alternates: { canonical: `${PORTFOLIO_URL}/blogs` },
};

export default function BlogsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
