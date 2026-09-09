import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import { crafts } from "@/app/craft/_registry";
import {
  isKnownPagePath,
  markdownPathFor,
  normalizePagePath,
  pagePathForMarkdown,
  STATIC_PAGE_PATHS,
} from "@/lib/agents/routes";

const slugs = crafts.map((craft) => craft.slug);
const appDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "app",
);

describe("normalizePagePath", () => {
  it("collapses trailing slashes but keeps the root", () => {
    assert.equal(normalizePagePath("/"), "/");
    assert.equal(normalizePagePath("/work"), "/work");
    assert.equal(normalizePagePath("/work/"), "/work");
    assert.equal(normalizePagePath("/craft///"), "/craft");
  });
});

describe("isKnownPagePath", () => {
  it("recognises every static page", () => {
    for (const page of STATIC_PAGE_PATHS) {
      assert.equal(isKnownPagePath(page, slugs), true, page);
    }
  });

  it("recognises a craft that exists and rejects one that does not", () => {
    assert.equal(isKnownPagePath(`/craft/${slugs[0]}`, slugs), true);
    assert.equal(isKnownPagePath("/craft/not-a-craft", slugs), false);
    assert.equal(isKnownPagePath(`/craft/${slugs[0]}/extra`, slugs), false);
  });

  it("rejects paths the site does not serve", () => {
    assert.equal(isKnownPagePath("/admin", slugs), false);
    assert.equal(isKnownPagePath("/work/2024", slugs), false);
    assert.equal(isKnownPagePath("/does-not-exist", slugs), false);
  });

  it("ignores a trailing slash", () => {
    assert.equal(isKnownPagePath("/about/", slugs), true);
  });
});

describe("markdown siblings", () => {
  it("appends the extension, and names the root index.md", () => {
    assert.equal(markdownPathFor("/"), "/index.md");
    assert.equal(markdownPathFor("/about"), "/about.md");
    assert.equal(markdownPathFor("/craft/morph-menu"), "/craft/morph-menu.md");
    assert.equal(markdownPathFor("/about/"), "/about.md");
  });

  it("round-trips every page it produces", () => {
    for (const page of [...STATIC_PAGE_PATHS, `/craft/${slugs[0]}`]) {
      assert.equal(pagePathForMarkdown(markdownPathFor(page)), page, page);
    }
  });

  it("is null for anything that is not a markdown sibling", () => {
    assert.equal(pagePathForMarkdown("/about"), null);
    assert.equal(pagePathForMarkdown("/"), null);
    assert.equal(pagePathForMarkdown("/.md"), null);
  });
});

describe("the route list against the app directory", () => {
  it("names every static page the router serves, and no others", async () => {
    const found = new Set<string>();

    const walk = async (directory: string, route: string): Promise<void> => {
      const entries = await readdir(directory, { withFileTypes: true });

      if (entries.some((entry) => entry.name === "page.tsx")) {
        found.add(route === "" ? "/" : route);
      }

      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        /* Route groups, private folders, dynamic segments and the API tree are
           not static pages. */
        if (/^[([_@]/.test(entry.name) || entry.name === "api") continue;

        await walk(path.join(directory, entry.name), `${route}/${entry.name}`);
      }
    };

    await walk(appDirectory, "");

    assert.deepEqual(
      [...found].sort(),
      [...STATIC_PAGE_PATHS].sort(),
      "STATIC_PAGE_PATHS has drifted from app/ — proxy.ts would 404 a real page",
    );
  });
});
