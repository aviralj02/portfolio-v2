import React from "react";
import { Metadata } from "next";

import { PORTFOLIO_URL } from "@/lib/constants";
import { socialMetadata } from "@/lib/metadata";

const title = "Blogs | Aviral";
const description =
  "I write insightful blogs sharing my thoughts on tech trends, development, and the tools I use.";

export const metadata: Metadata = {
  title,
  description,
  ...socialMetadata({ title, description, path: "/blogs" }),
  alternates: {
    canonical: `${PORTFOLIO_URL}/blogs`,
    types: { "text/markdown": `${PORTFOLIO_URL}/blogs.md` },
  },
};

export default function BlogsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
