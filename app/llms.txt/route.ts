import { crafts } from "@/app/craft/_registry";
import { renderLlmsTxt } from "@/lib/agents/markdown";

/**
 * Generated rather than kept in `public/`, so the craft list in it can never
 * fall behind the registry the pages are built from.
 */

export const dynamic = "force-static";

export const GET = (): Response =>
  new Response(renderLlmsTxt(crafts), {
    headers: {
      /* Markdown by content, but plain text by convention — the same choice
         robots.txt makes, and the one that renders in a browser tab. */
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
