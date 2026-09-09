import fs from "node:fs/promises";
import path from "node:path";

import { crafts, getCraft } from "@/app/craft/_registry";
import { PORTFOLIO_DESC } from "@/lib/constants";
import { buildTimeline } from "@/lib/experience";
import getBlogs from "@/lib/utils/get-blogs";
import getExperiences from "@/lib/utils/get-experience";
import getProjects from "@/lib/utils/get-projects";

import {
  renderBlogs,
  renderContentPage,
  renderCraftDetail,
  renderCraftIndex,
  renderIndex,
  renderNotFound,
  renderWork,
} from "./markdown";
import { normalizePagePath } from "./routes";
import { contentPageFor } from "./site-content";

/**
 * Assembles the Markdown representation of a path from the same sources the
 * React pages read. Rendering lives in `markdown.ts`, which is pure; this file
 * is only the wiring, so a CMS outage degrades a document rather than failing
 * the request.
 */

export type MarkdownDocument = { body: string; status: 200 | 404 };

const GITHUB_BLOB_BASE_URL =
  "https://github.com/aviralj02/portfolio-v2/blob/main";

const CRAFTS_DIRECTORY = path.join(process.cwd(), "components", "crafts");

const craftSlugs = crafts.map((craft) => craft.slug);

const buildIndex = async (): Promise<string> => {
  const [blogs, projects] = await Promise.all([getBlogs(), getProjects()]);

  return renderIndex({
    description: PORTFOLIO_DESC,
    craftSlugs,
    recentBlog: blogs?.[0] ?? null,
    recentProject: projects?.[0] ?? null,
  });
};

const buildWork = async (): Promise<string> => {
  const [experiences, projects] = await Promise.all([
    getExperiences(),
    getProjects(),
  ]);

  const timeline = buildTimeline(experiences, new Date().toISOString());

  return renderWork({
    roles:
      timeline?.entries.map((entry) => ({
        role: entry.role,
        company: entry.company,
        url: entry.url,
        range: entry.range,
        duration: entry.duration,
      })) ?? [],
    projects:
      projects?.map((project) => ({
        title: project.title,
        intro: project.intro,
        description: project.description,
        stack: project.stack,
        live: project.live,
        codebase: project.codebase,
      })) ?? [],
  });
};

const buildBlogs = async (): Promise<string> =>
  renderBlogs((await getBlogs()) ?? []);

const buildCraftDetail = async (slug: string): Promise<string | null> => {
  const craft = getCraft(slug);
  if (!craft) return null;

  /* The write-up is the page's prose; without it the document is just links.
     The read is scoped to the crafts directory and hidden from the tracer,
     which would otherwise pull the whole repository into the deployment —
     `outputFileTracingIncludes` in next.config.mjs ships the files instead. */
  let writeup = "";
  if (craft.writeupPath) {
    try {
      writeup = await fs.readFile(
        path.join(/* turbopackIgnore: true */ CRAFTS_DIRECTORY, craft.slug, "writeup.md"),
        "utf8",
      );
    } catch {
      /* Left out rather than failing the document. */
    }
  }

  return renderCraftDetail({
    slug: craft.slug,
    title: craft.title,
    description: craft.description,
    writeup,
    sourceUrls: [craft.sourcePath, ...(craft.otherSourcePaths ?? [])].map(
      (filePath) => ({
        path: filePath,
        url: `${GITHUB_BLOB_BASE_URL}/${filePath}`,
      }),
    ),
  });
};

export const buildMarkdownDocument = async (
  pathname: string,
): Promise<MarkdownDocument> => {
  const route = normalizePagePath(pathname);

  const content = contentPageFor(route);
  if (content) return { body: renderContentPage(content), status: 200 };

  if (route === "/") return { body: await buildIndex(), status: 200 };
  if (route === "/work") return { body: await buildWork(), status: 200 };
  if (route === "/blogs") return { body: await buildBlogs(), status: 200 };
  if (route === "/craft")
    return { body: renderCraftIndex(crafts), status: 200 };

  const craft = route.match(/^\/craft\/([^/]+)$/);
  if (craft) {
    const body = await buildCraftDetail(craft[1]);
    if (body) return { body, status: 200 };
  }

  return { body: renderNotFound(route, craftSlugs), status: 404 };
};
