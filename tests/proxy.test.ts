import { NextRequest } from "next/server";

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import proxy from "@/proxy";

/**
 * The proxy is the whole of this site's content negotiation, so it is checked
 * against the four things acceptmarkdown.com looks for: Markdown on request,
 * `Vary: Accept`, a 406 for what it cannot produce, and honoured q-values.
 */

const BROWSER =
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8";

const run = (pathname: string, accept?: string) => {
  const headers = new Headers();
  if (accept !== undefined) headers.set("accept", accept);

  return proxy(
    new NextRequest(`https://heyaviral.com${pathname}`, { headers }),
  );
};

const rewriteTarget = (response: Response): string | null => {
  const target = response.headers.get("x-middleware-rewrite");

  return target === null ? null : new URL(target).pathname;
};

describe("markdown on request", () => {
  it("rewrites a page to the markdown handler", () => {
    assert.equal(
      rewriteTarget(run("/about", "text/markdown")),
      "/api/markdown/about",
    );
  });

  it("rewrites the home page to the handler's root", () => {
    assert.equal(rewriteTarget(run("/", "text/markdown")), "/api/markdown");
  });

  it("rewrites a craft detail page", () => {
    assert.equal(
      rewriteTarget(run("/craft/morph-menu", "text/markdown")),
      "/api/markdown/craft/morph-menu",
    );
  });

  it("leaves HTML alone for a browser", () => {
    assert.equal(rewriteTarget(run("/about", BROWSER)), null);
  });

  it("honours q-values rather than the order alone", () => {
    assert.equal(rewriteTarget(run("/about", "text/markdown;q=0.4, text/html;q=0.8")), null);
    assert.equal(
      rewriteTarget(run("/about", "text/html;q=0.4, text/markdown;q=0.8")),
      "/api/markdown/about",
    );
  });

  it("respects an explicit refusal of markdown behind a wildcard", () => {
    assert.equal(rewriteTarget(run("/about", "text/markdown;q=0, */*")), null);
  });
});

describe("the .md sibling", () => {
  it("serves markdown whatever the client accepts, including nothing", () => {
    assert.equal(rewriteTarget(run("/about.md")), "/api/markdown/about");
    assert.equal(rewriteTarget(run("/about.md", BROWSER)), "/api/markdown/about");
  });

  it("maps /index.md to the home page", () => {
    assert.equal(rewriteTarget(run("/index.md")), "/api/markdown");
  });

  it("still resolves for a craft page", () => {
    assert.equal(
      rewriteTarget(run("/craft/morph-menu.md")),
      "/api/markdown/craft/morph-menu",
    );
  });
});

describe("Vary and Link", () => {
  it("adds Accept to Vary on every response it touches", () => {
    for (const response of [
      run("/", BROWSER),
      run("/about", "text/markdown"),
      run("/about.md"),
      run("/nope", BROWSER),
      run("/about", "application/pdf"),
    ]) {
      assert.match(response.headers.get("vary") ?? "", /accept/i);
    }
  });

  it("advertises the markdown sibling and llms.txt on an HTML page", () => {
    const link = run("/work", BROWSER).headers.get("link") ?? "";

    assert.match(link, /<https:\/\/heyaviral\.com\/work\.md>/);
    assert.match(link, /rel="alternate"/);
    assert.match(link, /type="text\/markdown"/);
    assert.match(link, /<https:\/\/heyaviral\.com\/llms\.txt>; rel="describedby"/);
  });

  it("advertises nothing for a path that is not a page", () => {
    assert.equal(run("/nope", BROWSER).headers.get("link"), null);
  });
});

describe("406", () => {
  it("refuses a type it cannot produce", async () => {
    const response = run("/about", "application/pdf");

    assert.equal(response.status, 406);
    assert.equal(
      response.headers.get("content-type"),
      "text/plain; charset=utf-8",
    );
    assert.match(await response.text(), /text\/html, text\/markdown/);
  });
});

describe("paths that do not exist", () => {
  it("sends a browser to the rendered 404", () => {
    assert.equal(rewriteTarget(run("/nope", BROWSER)), null);
    assert.equal(rewriteTarget(run("/craft/not-a-craft", BROWSER)), null);
  });

  it("sends anything that did not ask for HTML the markdown recovery page", () => {
    assert.equal(rewriteTarget(run("/nope")), "/api/markdown/nope");
    assert.equal(rewriteTarget(run("/nope", "*/*")), "/api/markdown/nope");
    assert.equal(
      rewriteTarget(run("/nope", "text/markdown")),
      "/api/markdown/nope",
    );
    assert.equal(
      rewriteTarget(run("/a/deep/one", "*/*")),
      "/api/markdown/a/deep/one",
    );
  });

  it("still refuses a type it cannot produce, rather than 404ing in markdown", () => {
    assert.equal(run("/nope", "application/pdf").status, 406);
  });
});
