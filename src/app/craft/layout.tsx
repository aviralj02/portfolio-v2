import React from "react";
import { Metadata } from "next";

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
