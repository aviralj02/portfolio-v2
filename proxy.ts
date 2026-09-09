import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { crafts } from "@/app/craft/_registry";
import {
  acceptsHtmlExplicitly,
  appendVaryAccept,
  MARKDOWN,
  negotiate,
} from "@/lib/agents/accept";
import {
  isKnownPagePath,
  markdownPathFor,
  pagePathForMarkdown,
} from "@/lib/agents/routes";
import { PORTFOLIO_URL } from "@/lib/constants";

/**
 * Content negotiation for the whole site: browsers keep getting HTML, agents
 * that ask for `text/markdown` get the same content without the layout around
 * it, and a path that is neither gets a 406 instead of a guess.
 */

const MARKDOWN_ROUTE = "/api/markdown";

const craftSlugs = crafts.map((craft) => craft.slug);

const rewriteToMarkdown = (
  request: NextRequest,
  pagePath: string,
): NextResponse => {
  const url = request.nextUrl.clone();
  url.pathname =
    pagePath === "/" ? MARKDOWN_ROUTE : `${MARKDOWN_ROUTE}${pagePath}`;

  const response = NextResponse.rewrite(url);
  appendVaryAccept(response.headers);

  return response;
};

const proxy = (request: NextRequest): NextResponse | Response => {
  const { pathname } = request.nextUrl;

  /* An explicit `.md` sibling is unambiguous: serve Markdown whatever the
     client says it accepts. This is the URL the `Link: rel="alternate"`
     header points at, and crawlers that follow it may send no Accept at all. */
  const siblingOf = pagePathForMarkdown(pathname);
  if (siblingOf) return rewriteToMarkdown(request, siblingOf);

  const accept = request.headers.get("accept");
  const chosen = negotiate(accept);

  if (chosen === null) {
    return new NextResponse(
      "Not Acceptable\n\nAvailable: text/html, text/markdown\n",
      {
        status: 406,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          Vary: "Accept",
        },
      },
    );
  }

  const known = isKnownPagePath(pathname, craftSlugs);

  if (!known) {
    /* A path that does not exist. Anything that did not ask for HTML by name
       gets the Markdown 404, which lists where to go instead; browsers fall
       through to the rendered not-found page. Either way the status is 404. */
    if (chosen === MARKDOWN || !acceptsHtmlExplicitly(accept)) {
      return rewriteToMarkdown(request, pathname);
    }
  } else if (chosen === MARKDOWN) {
    return rewriteToMarkdown(request, pathname);
  }

  const response = NextResponse.next();
  appendVaryAccept(response.headers);

  if (known) {
    response.headers.set(
      "Link",
      `<${PORTFOLIO_URL}${markdownPathFor(pathname)}>; rel="alternate"; type="text/markdown", <${PORTFOLIO_URL}/llms.txt>; rel="describedby"`,
    );
  }

  return response;
};

export default proxy;

export const config = {
  /* Everything except Next's internals, the API routes this file rewrites to,
     and static assets — `.md` is deliberately not in the exclusion list. */
  matcher: [
    "/((?!api/|_next/|_vercel/|.*\\.(?:ico|png|jpe?g|gif|svg|webp|avif|txt|xml|json|webmanifest|mp4|webm|woff2?|ttf|otf|css|js|map)$).*)",
  ],
};
