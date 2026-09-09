import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

/**
 * The home page is a bento grid whose visual order comes entirely from
 * `order-*` classes, which makes source order free to serve the document
 * instead — and easy to undo by accident. These guard the two properties an
 * agent reading the raw HTML depends on: the H1 comes first, and the grid is
 * followed by a written summary of it.
 */

const source = await readFile(
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "app", "page.tsx"),
  "utf8",
);

/** Tiles whose markup contains a heading, in the order they are written. */
const HEADING_TILES = [
  "AboutTile",
  "RecentBlogTile",
  "SpotifyTile",
  "CraftTile",
  "RecentProjectTile",
  "ContactTile",
];

describe("home page source order", () => {
  it("renders the tile carrying the H1 before any tile carrying an H2", () => {
    const positions = HEADING_TILES.map((tile) => ({
      tile,
      at: source.indexOf(`<${tile}`),
    }));

    for (const { tile, at } of positions) {
      assert.ok(at > -1, `${tile} is no longer on the page`);
    }

    const [about, ...rest] = positions;

    assert.equal(about.tile, "AboutTile");
    for (const other of rest) {
      assert.ok(
        about.at < other.at,
        `AboutTile must precede ${other.tile}, or the first heading is an H2`,
      );
    }
  });

  it("keeps SpotifyTile before CraftTile, which share an order slot at lg", () => {
    /* Equal `order` values fall back to source order, so swapping these two
       would move them in the rendered grid. */
    assert.ok(source.indexOf("<SpotifyTile") < source.indexOf("<CraftTile"));
  });

  it("still renders the written summary of the grid", () => {
    assert.match(source, /<HomeSummary \/>/);
  });
});

describe("the home page's H1", () => {
  it("lives in AboutTile, and is the only one there", async () => {
    const tile = await readFile(
      path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "..",
        "components",
        "all",
        "grid-tiles",
        "AboutTile.tsx",
      ),
      "utf8",
    );

    assert.equal(tile.match(/<h1[\s>]/g)?.length, 1);
  });

  it("is not competed with by the summary, which starts at H2", async () => {
    const summary = await readFile(
      path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "..",
        "components",
        "all",
        "HomeSummary.tsx",
      ),
      "utf8",
    );

    assert.doesNotMatch(summary, /<h1[\s>]/);
    assert.match(summary, /<h2[\s>]/);
    assert.match(summary, /className="sr-only"/);
  });
});
