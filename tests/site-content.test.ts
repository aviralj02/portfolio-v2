import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { crafts } from "@/app/craft/_registry";
import { isKnownPagePath } from "@/lib/agents/routes";
import { CONTENT_PAGES, contentPageFor } from "@/lib/agents/site-content";

/**
 * These three pages exist to be read — by a person deciding whether to write
 * in, and by an agent deciding whether this site is a real one. Both need the
 * same thing: enough substance to be worth the fetch, and links that resolve.
 */

const slugs = crafts.map((craft) => craft.slug);

/** Everything `ContentPage` puts on screen, minus the markup around it. */
const visibleText = (path: string): string => {
  const page = contentPageFor(path);
  assert.ok(page, `no content page at ${path}`);

  const blocks = page.sections.flatMap((section) => [
    section.heading,
    ...section.blocks.flatMap((block) => {
      if (block.kind === "paragraph") return [block.text];
      if (block.kind === "list") return block.items;

      return block.items.flatMap((item) => [item.label, item.note ?? ""]);
    }),
  ]);

  return [page.title, page.summary, ...blocks].join(" ");
};

describe("trust anchor pages", () => {
  it("covers about, contact and privacy", () => {
    assert.deepEqual(
      CONTENT_PAGES.map((page) => page.path).sort(),
      ["/about", "/contact", "/privacy"],
    );
  });

  for (const page of CONTENT_PAGES) {
    it(`${page.path} renders more than 500 characters`, () => {
      const length = visibleText(page.path).length;

      assert.ok(length > 500, `${page.path} rendered ${length} characters`);
    });

    it(`${page.path} has a summary, an eyebrow and a title`, () => {
      assert.ok(page.title.length > 0);
      assert.ok(page.eyebrow.length > 0);
      assert.ok(page.summary.length > 60);
    });

    it(`${page.path} records when it was last reviewed`, () => {
      assert.match(page.updated ?? "", /^\d{4}-\d{2}-\d{2}$/);
    });

    it(`${page.path} links only to pages that exist`, () => {
      const internal = page.sections
        .flatMap((section) => section.blocks)
        .flatMap((block) => (block.kind === "links" ? block.items : []))
        .filter((item) => item.href.startsWith("/"));

      assert.ok(internal.length > 0, "expected at least one internal link");

      for (const item of internal) {
        const [route] = item.href.split("#");

        assert.equal(
          isKnownPagePath(route === "" ? "/" : route, slugs),
          true,
          `${page.path} links to ${item.href}, which is not a page`,
        );
      }
    });

    it(`${page.path} marks its off-site links as external`, () => {
      for (const block of page.sections.flatMap(
        (section) => section.blocks,
      )) {
        if (block.kind !== "links") continue;

        for (const item of block.items) {
          if (item.href.startsWith("http")) {
            assert.equal(item.external, true, item.href);
          }
        }
      }
    });
  }
});

describe("contentPageFor", () => {
  it("is undefined for a path it does not own", () => {
    assert.equal(contentPageFor("/work"), undefined);
    assert.equal(contentPageFor("/"), undefined);
  });
});
