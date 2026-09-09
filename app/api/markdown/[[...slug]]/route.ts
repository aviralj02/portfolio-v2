import { buildMarkdownDocument } from "@/lib/agents/documents";
import { PORTFOLIO_URL } from "@/lib/constants";

/**
 * The Markdown half of this site's content negotiation. `proxy.ts` rewrites
 * here when a client asks for `text/markdown`, when it requests the `.md`
 * sibling of a page, and when it lands on a path that does not exist — which
 * is why a 404 leaves through this handler with a body worth reading.
 *
 * https://acceptmarkdown.com/recipes/nextjs
 */

export const dynamic = "force-dynamic";

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ slug?: string[] }> },
): Promise<Response> => {
  const { slug = [] } = await params;
  const pathname = `/${slug.join("/")}`;

  const { body, status } = await buildMarkdownDocument(pathname);

  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept",
      "Cache-Control":
        status === 200
          ? "public, s-maxage=3600, stale-while-revalidate=86400"
          : "public, max-age=0, must-revalidate",
      Link:
        status === 200
          ? `<${PORTFOLIO_URL}${pathname}>; rel="canonical", <${PORTFOLIO_URL}/llms.txt>; rel="describedby"`
          : `<${PORTFOLIO_URL}/llms.txt>; rel="describedby"`,
    },
  });
};
