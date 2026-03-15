import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Crafts | Aviral",
  description:
    "UI experiments, animations, and interactive demos built as a frontend engineer.",
};

export default function CraftsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
