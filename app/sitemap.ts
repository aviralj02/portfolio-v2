import { MetadataRoute } from "next";

import { crafts } from "@/app/craft/_registry";
import { PORTFOLIO_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  return [
    {
      url: PORTFOLIO_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${PORTFOLIO_URL}/work`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${PORTFOLIO_URL}/craft`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...crafts.map((craft) => ({
      url: `${PORTFOLIO_URL}/craft/${craft.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    {
      url: `${PORTFOLIO_URL}/blogs`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${PORTFOLIO_URL}/about`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${PORTFOLIO_URL}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${PORTFOLIO_URL}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
