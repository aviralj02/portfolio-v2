import { notFound } from "next/navigation";

import { OG_SIZE, renderCraftCard } from "@/lib/og/craft-card";

import { crafts, getCraft } from "../_registry";

export const alt = "A craft by Aviral Jain";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return crafts.map((c) => ({ slug: c.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const craft = getCraft(slug);

  if (!craft) notFound();

  return renderCraftCard(craft);
}
