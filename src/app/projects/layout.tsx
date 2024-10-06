import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Projects | Aviral",
  description:
    "Explore my projects where I've not only built impactful solutions but also demonstrated my ability to quickly learn and apply new skills.",
};

export default function ProjectsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
