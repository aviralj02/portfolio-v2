import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Work | Aviral",
  description:
    "Explore my work experience, showcasing impactful contributions and skills I have demonstrated.",
};

export default function WorkLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
