import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs | Aviral",
  description:
    "I write insightful blogs sharing my thoughts on tech trends, development, and the tools I use.",
};

export default function BlogsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
