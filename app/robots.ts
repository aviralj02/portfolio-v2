import { MetadataRoute } from "next";

import { PORTFOLIO_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: ["/admin/"],
    },
    sitemap: [`${PORTFOLIO_URL}/sitemap.xml`],
  };
}
