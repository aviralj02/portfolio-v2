import { MetadataRoute } from "next";

import { PORTFOLIO_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      /* `/api/markdown` is the internal target of the Markdown rewrite; the
         representation it serves is already reachable at every real URL. */
      disallow: ["/admin/", "/api/"],
    },
    sitemap: [`${PORTFOLIO_URL}/sitemap.xml`],
  };
}
