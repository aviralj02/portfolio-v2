import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  acceptsHtmlExplicitly,
  appendVaryAccept,
  HTML,
  MARKDOWN,
  negotiate,
  parseAccept,
} from "@/lib/agents/accept";

describe("parseAccept", () => {
  it("defaults q to 1 and records specificity", () => {
    assert.deepEqual(parseAccept("text/markdown"), [
      { type: "text/markdown", q: 1, specificity: 2 },
    ]);
    assert.deepEqual(parseAccept("text/*"), [
      { type: "text/*", q: 1, specificity: 1 },
    ]);
    assert.deepEqual(parseAccept("*/*"), [
      { type: "*/*", q: 1, specificity: 0 },
    ]);
  });

  it("reads q-values, clamps them, and ignores other parameters", () => {
    assert.deepEqual(parseAccept("text/html;level=1;q=0.4"), [
      { type: "text/html", q: 0.4, specificity: 2 },
    ]);
    assert.equal(parseAccept("text/html;q=9")[0].q, 1);
    assert.equal(parseAccept("text/html;q=-1")[0].q, 0);
    assert.equal(parseAccept("text/html;q=nonsense")[0].q, 1);
  });

  it("lowercases the media type and tolerates whitespace", () => {
    assert.deepEqual(parseAccept("  TEXT/Markdown ; q=0.5 "), [
      { type: "text/markdown", q: 0.5, specificity: 2 },
    ]);
  });
});

describe("negotiate", () => {
  it("serves HTML when the client expresses no preference", () => {
    assert.equal(negotiate(null), HTML);
    assert.equal(negotiate(undefined), HTML);
    assert.equal(negotiate("*/*"), HTML);
  });

  it("serves HTML to a browser", () => {
    assert.equal(
      negotiate(
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      ),
      HTML,
    );
  });

  it("serves Markdown when it is asked for by name", () => {
    assert.equal(negotiate("text/markdown"), MARKDOWN);
    assert.equal(negotiate("text/markdown, text/html;q=0.9"), MARKDOWN);
  });

  it("ranks by q-value before client order", () => {
    assert.equal(negotiate("text/html;q=0.5, text/markdown;q=0.9"), MARKDOWN);
    assert.equal(negotiate("text/markdown;q=0.4, text/html;q=0.8"), HTML);
  });

  it("breaks equal q-values on client order", () => {
    assert.equal(negotiate("text/markdown, text/html, */*"), MARKDOWN);
    assert.equal(negotiate("text/html, text/markdown, */*"), HTML);
  });

  it("treats q=0 as a refusal, even against a wildcard (RFC 9110 12.5.1)", () => {
    assert.equal(negotiate("text/html;q=0, */*"), MARKDOWN);
    assert.equal(negotiate("text/markdown;q=0, */*"), HTML);
  });

  it("matches a subtype wildcard", () => {
    assert.equal(negotiate("text/*"), HTML);
    assert.equal(negotiate("text/*;q=0.2, text/markdown;q=0.9"), MARKDOWN);
  });

  it("returns null — a 406 — when nothing it produces is acceptable", () => {
    assert.equal(negotiate("application/pdf"), null);
    assert.equal(negotiate("image/png, application/json"), null);
    assert.equal(negotiate("*/*;q=0"), null);
  });
});

describe("acceptsHtmlExplicitly", () => {
  it("is true only when HTML is named rather than tolerated", () => {
    assert.equal(acceptsHtmlExplicitly("text/html,*/*;q=0.8"), true);
    assert.equal(acceptsHtmlExplicitly("text/*"), true);
    assert.equal(acceptsHtmlExplicitly("*/*"), false);
    assert.equal(acceptsHtmlExplicitly(null), false);
    assert.equal(acceptsHtmlExplicitly("text/markdown"), false);
  });

  it("does not count HTML that was refused", () => {
    assert.equal(acceptsHtmlExplicitly("text/html;q=0, */*"), false);
  });
});

describe("appendVaryAccept", () => {
  it("sets the header when there is nothing to preserve", () => {
    const headers = new Headers();
    appendVaryAccept(headers);

    assert.equal(headers.get("Vary"), "Accept");
  });

  it("keeps Next's router tokens and adds Accept alongside them", () => {
    const headers = new Headers({ Vary: "rsc, next-router-state-tree" });
    appendVaryAccept(headers);

    assert.equal(headers.get("Vary"), "rsc, next-router-state-tree, Accept");
  });

  it("is idempotent, whatever the casing", () => {
    const headers = new Headers({ Vary: "rsc, accept" });
    appendVaryAccept(headers);
    appendVaryAccept(headers);

    assert.equal(headers.get("Vary"), "rsc, accept");
  });

  it("leaves a wildcard Vary alone", () => {
    const headers = new Headers({ Vary: "*" });
    appendVaryAccept(headers);

    assert.equal(headers.get("Vary"), "*");
  });
});
