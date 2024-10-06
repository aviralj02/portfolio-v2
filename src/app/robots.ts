import { PORTFOLIO_URL } from "@/lib/constants";
import { MetadataRoute } from "next";

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
