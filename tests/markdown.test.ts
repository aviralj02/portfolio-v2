import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { crafts } from "@/app/craft/_registry";
import {
  renderBlogs,
  renderContentPage,
  renderCraftDetail,
  renderCraftIndex,
  renderIndex,
  renderLlmsTxt,
  renderNotFound,
  renderWork,
} from "@/lib/agents/markdown";
import { CONTENT_PAGES } from "@/lib/agents/site-content";
import { PORTFOLIO_URL } from "@/lib/constants";

/** Plain prose only: what a reader is left with once the syntax is stripped. */
const proseLength = (markdown: string): number =>
  markdown
    .replace(/^---[\s\S]*$/m, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`-]/g, "")
    .replace(/\s+/g, " ")
    .trim().length;

describe("trust anchor pages", () => {
  for (const page of CONTENT_PAGES) {
    it(`${page.path} carries well past 500 characters of content`, () => {
      const body = renderContentPage(page);

      assert.ok(
        proseLength(body) > 500,
        `${page.path} rendered only ${proseLength(body)} characters`,
      );
    });

    it(`${page.path} opens with an H1 and a summary blockquote`, () => {
      const [heading, blank, summary] = renderContentPage(page).split("\n");

      assert.equal(heading, `# ${page.title}`);
      assert.equal(blank, "");
      assert.ok(summary.startsWith("> "));
    });

    it(`${page.path} keeps its heading levels sequential`, () => {
      const levels = [...renderContentPage(page).matchAll(/^(#+) /gm)].map(
        (match) => match[1].length,
      );

      assert.equal(levels[0], 1);
      for (let index = 1; index < levels.length; index++) {
        assert.ok(
          levels[index] <= levels[index - 1] + 1,
          `jumped from h${levels[index - 1]} to h${levels[index]}`,
        );
      }
    });

    it(`${page.path} points back at its HTML twin and at llms.txt`, () => {
      const body = renderContentPage(page);

      assert.match(body, new RegExp(`${PORTFOLIO_URL}${page.path}`));
      assert.match(body, new RegExp(`${PORTFOLIO_URL}/llms.txt`));
    });

    it(`${page.path} absolutises every link`, () => {
      const hrefs = [
        ...renderContentPage(page).matchAll(/\]\(([^)]+)\)/g),
      ].map((match) => match[1]);

      assert.ok(hrefs.length > 0);
      for (const href of hrefs) {
        assert.match(href, /^https?:\/\//, href);
      }
    });
  }
});

describe("renderNotFound", () => {
  const body = renderNotFound("/does-not-exist", ["morph-menu"]);

  it("names the path that failed", () => {
    assert.match(body, /`\/does-not-exist`/);
  });

  it("lists a markdown sibling for every page, so recovery is one fetch", () => {
    assert.match(body, /\/index\.md/);
    assert.match(body, /\/work\.md/);
    assert.match(body, /\/about\.md/);
    assert.match(body, /\/craft\/morph-menu\.md/);
  });

  it("points at the machine-readable index files", () => {
    assert.match(body, new RegExp(`${PORTFOLIO_URL}/llms.txt`));
    assert.match(body, new RegExp(`${PORTFOLIO_URL}/sitemap.xml`));
  });

  it("stays short enough to be worth reading", () => {
    assert.ok(body.length < 2500, `404 body was ${body.length} characters`);
  });
});

describe("renderLlmsTxt", () => {
  const body = renderLlmsTxt(crafts);
  const lines = body.split("\n");

  it("starts with an H1 followed by a blockquote summary (llmstxt.org)", () => {
    assert.equal(lines[0], "# Aviral Jain");
    assert.equal(lines[1], "");
    assert.ok(lines[2].startsWith("> "));
  });

  it("has exactly one H1", () => {
    assert.equal(body.match(/^# /gm)?.length, 1);
  });

  it("uses no heading level other than H1 and H2", () => {
    for (const [, hashes] of body.matchAll(/^(#+) /gm)) {
      assert.ok(hashes.length <= 2, `unexpected h${hashes.length}`);
    }
  });

  it("keeps the free-form detail above the first H2, as the spec requires", () => {
    const detail = body.slice(body.indexOf(lines[2]), body.indexOf("\n## "));

    assert.doesNotMatch(detail, /^#/m);
    assert.match(detail, /When to use this site/);
    assert.match(detail, /When not to use it/);
  });

  it("says how an agent should call the site", () => {
    assert.match(body, /Accept: text\/markdown/);
    assert.match(body, /Vary: Accept/);
    assert.match(body, /`\.md`/);
  });

  it("gives every H2 section nothing but a list of described links", () => {
    const sections = body.split(/^## .*$/m).slice(1);

    assert.ok(sections.length >= 3);
    for (const section of sections) {
      for (const line of section.split("\n").filter(Boolean)) {
        assert.match(line, /^- \[[^\]]+\]\(https?:\/\/[^)]+\)(: .+)?$/, line);
      }
    }
  });

  it("lists every craft in the registry", () => {
    for (const craft of crafts) {
      assert.match(body, new RegExp(`/craft/${craft.slug}\\.md`), craft.slug);
    }
  });
});

describe("renderIndex", () => {
  const body = renderIndex({
    description: "A description of the site.",
    craftSlugs: ["morph-menu"],
    recentBlog: {
      title: "A post",
      link: "https://medium.com/@a/post",
      publishDate: "2026-01-02T00:00:00Z",
    },
    recentProject: {
      title: "A project",
      codebase: "https://github.com/aviralj02/project",
    },
  });

  it("leads with the site name and the summary it was given", () => {
    assert.match(body, /^# Aviral Jain\n\n> A description of the site\./);
  });

  it("surfaces the most recent post and project", () => {
    assert.match(body, /Latest post: A post/);
    assert.match(body, /2026-01-02/);
    assert.match(body, /Latest project: A project/);
  });

  it("omits the recent section entirely when the CMS is unreachable", () => {
    const degraded = renderIndex({
      description: "A description.",
      craftSlugs: [],
      recentBlog: null,
      recentProject: null,
    });

    assert.doesNotMatch(degraded, /## Most recent/);
    assert.match(degraded, /## Pages/);
  });
});

describe("renderWork", () => {
  it("renders roles and projects with their links", () => {
    const body = renderWork({
      roles: [
        {
          role: "Engineer",
          company: "Acme",
          url: "https://acme.test",
          range: "Jun 2024 – Sep 2024",
          duration: "3 mos",
        },
      ],
      projects: [
        {
          title: "Thing",
          intro: "A thing.",
          stack: ["TypeScript", "Next.js"],
          live: "https://thing.test",
          codebase: "https://github.com/aviralj02/thing",
        },
      ],
    });

    assert.match(body, /- \*\*Engineer\*\* — \[Acme\]\(https:\/\/acme\.test\)/);
    assert.match(body, /### Thing/);
    assert.match(body, /Stack: TypeScript, Next\.js\./);
    assert.match(body, /\[Live\]\(https:\/\/thing\.test\)/);
  });

  it("drops the empty sections rather than printing bare headings", () => {
    const body = renderWork({ roles: [], projects: [] });

    assert.doesNotMatch(body, /## Experience/);
    assert.doesNotMatch(body, /## Projects/);
  });
});

describe("renderCraftIndex and renderCraftDetail", () => {
  it("links each experiment to its own markdown page", () => {
    const body = renderCraftIndex([
      { slug: "morph-menu", title: "Morph Menu", description: "A menu." },
    ]);

    assert.match(body, /\[Morph Menu\]\(.*\/craft\/morph-menu\.md\): A menu\./);
  });

  it("carries the write-up and the source links", () => {
    const body = renderCraftDetail({
      slug: "morph-menu",
      title: "Morph Menu",
      description: "A menu popover that morphs out of its trigger.",
      writeup: "## How it works\n\nIt morphs.",
      sourceUrls: [
        {
          path: "components/crafts/morph-menu/index.tsx",
          url: "https://github.com/aviralj02/portfolio-v2/blob/main/components/crafts/morph-menu/index.tsx",
        },
      ],
    });

    assert.match(body, /^# Morph Menu/);
    assert.match(body, /## How it works/);
    assert.match(body, /## Source/);
    assert.match(body, /morph-menu\/index\.tsx/);
  });
});

describe("renderBlogs", () => {
  it("lists posts with their date and reading time", () => {
    const body = renderBlogs([
      {
        title: "A post",
        link: "https://medium.com/@a/post",
        publishDate: "2026-01-02T00:00:00Z",
        readTime: 4,
        description: "  Something   worth  reading. ",
      },
    ]);

    assert.match(body, /\[A post\]\(https:\/\/medium\.com\/@a\/post\)/);
    assert.match(body, /2026-01-02 · 4 min read\. Something worth reading\./);
  });

  it("says so plainly when there is nothing published", () => {
    const body = renderBlogs([]);

    assert.match(body, /No posts are published right now\./);
    assert.doesNotMatch(body, /## Posts/);
  });
});
