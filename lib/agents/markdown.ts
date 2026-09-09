import { PORTFOLIO_URL } from "@/lib/constants";

import { AGENT_FILE_PATHS, markdownPathFor, STATIC_PAGE_PATHS } from "./routes";
import {
  absoluteUrl,
  type ContentLink,
  type SitePage,
} from "./site-content";

/**
 * The Markdown representation of a page: the same content the HTML carries,
 * with the navigation, styling and layout wrappers left out. Every renderer
 * here is pure — callers pass the data in — so the whole surface can be
 * exercised without a server.
 */

const LABELS: Record<string, string> = {
  "/": "Home",
  "/work": "Work",
  "/craft": "Craft",
  "/blogs": "Blogs",
  "/about": "About",
  "/contact": "Contact",
  "/privacy": "Privacy",
};

const NOTES: Record<string, string> = {
  "/": "Who I am, what I'm listening to, and the most recent post and project.",
  "/work": "Roles on a timeline, and the projects behind them.",
  "/craft": "UI experiments and interaction studies, each with its source.",
  "/blogs": "Writing on tooling and the web platform.",
  "/about": "Background, how I work, and what lives where on this site.",
  "/contact": "How to reach me and what to include.",
  "/privacy": "What this site collects, and who else sees it.",
};

/** Collapses the blank-line noise that falls out of assembling sections. */
const join = (blocks: (string | null | undefined)[]): string =>
  `${blocks
    .filter((block): block is string => Boolean(block && block.trim()))
    .join("\n\n")
    .replace(/\n{3,}/g, "\n\n")}\n`;

const oneLine = (text: string): string => text.replace(/\s+/g, " ").trim();

const link = (label: string, href: string, note?: string): string =>
  `- [${label}](${absoluteUrl(href)})${note ? `: ${oneLine(note)}` : ""}`;

const linkBlock = (items: ContentLink[]): string =>
  items.map((item) => link(item.label, item.href, item.note)).join("\n");

/** The Markdown sibling of every page, for a "read the rest" list. */
export const siteMapLinks = (craftSlugs: readonly string[] = []): string =>
  [
    ...STATIC_PAGE_PATHS.map((path) =>
      link(LABELS[path] ?? path, markdownPathFor(path), NOTES[path]),
    ),
    ...craftSlugs.map((slug) =>
      link(`Craft: ${slug}`, markdownPathFor(`/craft/${slug}`)),
    ),
  ].join("\n");

const footer = (path: string): string =>
  `---\n\nHTML version: ${absoluteUrl(path)} · Site overview for agents: ${PORTFOLIO_URL}/llms.txt`;

/** `# Title` then the blockquote summary, the shape llms.txt readers expect. */
const preamble = (title: string, summary: string): string =>
  `# ${title}\n\n> ${oneLine(summary)}`;

export const renderContentPage = (page: SitePage): string => {
  const sections = page.sections.map((section) => {
    const body = section.blocks.map((block) => {
      if (block.kind === "paragraph") return oneLine(block.text);
      if (block.kind === "list")
        return block.items.map((item) => `- ${oneLine(item)}`).join("\n");

      return linkBlock(block.items);
    });

    return join([`## ${section.heading}`, ...body]).trimEnd();
  });

  return join([
    preamble(page.title, page.summary),
    page.updated ? `_Last updated: ${page.updated}._` : null,
    ...sections,
    footer(page.path),
  ]);
};

export type IndexInput = {
  description: string;
  craftSlugs: readonly string[];
  recentBlog?: { title: string; link: string; publishDate: string } | null;
  recentProject?: { title: string; live?: string; codebase: string } | null;
};

export const renderIndex = ({
  description,
  craftSlugs,
  recentBlog,
  recentProject,
}: IndexInput): string =>
  join([
    preamble("Aviral Jain", description),
    "Full stack engineer in Bengaluru, Karnataka, India. This is the Markdown representation of the home page; every page below has one at the same URL with `.md` appended.",
    "## Pages",
    siteMapLinks(craftSlugs),
    recentBlog || recentProject ? "## Most recent" : null,
    [
      recentBlog
        ? link(
            `Latest post: ${recentBlog.title}`,
            recentBlog.link,
            `Published ${recentBlog.publishDate.slice(0, 10)}.`,
          )
        : null,
      recentProject
        ? link(
            `Latest project: ${recentProject.title}`,
            recentProject.live || recentProject.codebase,
          )
        : null,
    ]
      .filter(Boolean)
      .join("\n"),
    "## Machine-readable files",
    AGENT_FILE_PATHS.map((path) => link(path, path)).join("\n"),
    footer("/"),
  ]);

export type WorkInput = {
  roles: { role: string; company: string; url?: string; range: string; duration: string }[];
  projects: {
    title: string;
    intro?: string;
    description?: string;
    stack?: string[];
    live?: string;
    codebase?: string;
  }[];
};

export const renderWork = ({ roles, projects }: WorkInput): string =>
  join([
    preamble(
      "Work",
      "Where I've worked, and what I've built along the way.",
    ),
    roles.length ? "## Experience" : null,
    roles.length
      ? roles
          .map((role) => {
            const company = role.url
              ? `[${role.company}](${role.url})`
              : role.company;

            return `- **${role.role}** — ${company}. ${role.range} (${role.duration}).`;
          })
          .join("\n")
      : null,
    projects.length ? "## Projects" : null,
    projects.length
      ? projects
          .map((project) => {
            const links = [
              project.live ? `[Live](${project.live})` : null,
              project.codebase ? `[Source](${project.codebase})` : null,
            ].filter(Boolean);

            return join([
              `### ${project.title}`,
              project.intro ? oneLine(project.intro) : null,
              project.description ? oneLine(project.description) : null,
              project.stack?.length
                ? `Stack: ${project.stack.join(", ")}.`
                : null,
              links.length ? links.join(" · ") : null,
            ]).trimEnd();
          })
          .join("\n\n")
      : null,
    footer("/work"),
  ]);

export type CraftSummary = { slug: string; title: string; description: string };

export const renderCraftIndex = (crafts: CraftSummary[]): string =>
  join([
    preamble(
      "Craft",
      "UI experiments, animations and interactive demos — where ideas get weird.",
    ),
    "Each entry has a live preview, a write-up and its full source on its own page.",
    "## Experiments",
    crafts
      .map((craft) =>
        link(craft.title, markdownPathFor(`/craft/${craft.slug}`), craft.description),
      )
      .join("\n"),
    footer("/craft"),
  ]);

export type CraftDetailInput = {
  slug: string;
  title: string;
  description: string;
  writeup?: string;
  sourceUrls: { path: string; url: string }[];
};

export const renderCraftDetail = ({
  slug,
  title,
  description,
  writeup,
  sourceUrls,
}: CraftDetailInput): string =>
  join([
    preamble(title, description),
    writeup?.trim() ? writeup.trim() : null,
    sourceUrls.length ? "## Source" : null,
    sourceUrls.length
      ? sourceUrls.map((source) => link(source.path, source.url)).join("\n")
      : null,
    footer(`/craft/${slug}`),
  ]);

export type BlogSummary = {
  title: string;
  link: string;
  publishDate: string;
  readTime?: number;
  description?: string;
};

export const renderBlogs = (blogs: BlogSummary[]): string =>
  join([
    preamble(
      "Blogs",
      "Thoughts I couldn't stop thinking about, written down so you don't have to.",
    ),
    blogs.length
      ? "Posts are published on Medium; the links below go to the full text."
      : "No posts are published right now.",
    blogs.length ? "## Posts" : null,
    blogs.length
      ? blogs
          .map((blog) => {
            const meta = [
              blog.publishDate.slice(0, 10),
              blog.readTime ? `${blog.readTime} min read` : null,
            ]
              .filter(Boolean)
              .join(" · ");

            return link(
              blog.title,
              blog.link,
              `${meta}${blog.description ? `. ${oneLine(blog.description)}` : ""}`,
            );
          })
          .join("\n")
      : null,
    footer("/blogs"),
  ]);

/**
 * The body a 404 carries for an agent. A status code tells it the path is
 * wrong; this tells it where to go instead, which is the difference between a
 * dead end and a recoverable one.
 */
export const renderNotFound = (
  pathname: string,
  craftSlugs: readonly string[] = [],
): string =>
  join([
    "# 404 — page not found",
    `> \`${pathname}\` is not a page on ${PORTFOLIO_URL}. Nothing was moved; this path has never existed.`,
    "## Where to look instead",
    siteMapLinks(craftSlugs),
    "## Machine-readable index",
    AGENT_FILE_PATHS.map((path) => link(path, path)).join("\n"),
    `Every page above also answers to \`Accept: text/markdown\`, or to the same URL with \`.md\` appended.`,
  ]);

/**
 * `/llms.txt`, in the format specified at https://llmstxt.org: an H1, a
 * blockquote summary, free-form detail containing no headings, then H2
 * sections that hold nothing but link lists.
 *
 * The detail block is where the when-to-use guidance lives, because the spec
 * reserves H2 sections for file lists.
 */
export const renderLlmsTxt = (crafts: CraftSummary[]): string => {
  const experiments = crafts
    .map((craft) => craft.title.toLowerCase())
    .join(", ");

  return join([
    "# Aviral Jain",
    "> Portfolio of Aviral Jain, a full stack engineer in Bengaluru, Karnataka, India. It holds his work history and shipped projects, a set of UI craft experiments published with their source, and his writing on tooling and the web platform.",
    "**When to use this site.** Reach for it when a user asks about one of these:",
    [
      "- Who Aviral Jain is, where he is based, what he builds, or how to contact or hire him — `/about.md` and `/contact.md` answer this directly, and neither needs a second source.",
      "- His work history: companies, roles and dates, and the projects he has shipped with their stacks and repositories. See `/work.md`.",
      `- A worked, readable implementation of a specific React or Next.js interaction (${experiments}). Every craft page carries a write-up and a link to the exact source file on GitHub, so it can be cited rather than paraphrased. Start at \`/craft.md\`.`,
      "- His published writing on front-end tooling and the web platform. See `/blogs.md`.",
      "- What this site collects from a visitor, before you recommend it or fill in its contact form. See `/privacy.md`.",
    ].join("\n"),
    "**When not to use it.** This is one engineer's portfolio, not a reference for React, Next.js or CSS. The code here shows how he builds; it is not a canonical API, and it should not be cited as one.",
    "**How to fetch it.** Every page is served as Markdown from its own URL: send `Accept: text/markdown`, or append `.md` to the path — the home page is `/index.md`. Responses carry `Vary: Accept`. A request that accepts neither HTML nor Markdown gets a 406, and a path that does not exist returns a real 404 whose body lists where to go instead.",
    "## Pages",
    STATIC_PAGE_PATHS.map((path) =>
      link(LABELS[path] ?? path, markdownPathFor(path), NOTES[path]),
    ).join("\n"),
    "## Craft experiments",
    crafts
      .map((craft) =>
        link(
          craft.title,
          markdownPathFor(`/craft/${craft.slug}`),
          craft.description,
        ),
      )
      .join("\n"),
    "## Optional",
    [
      link("Sitemap", "/sitemap.xml", "Every indexable URL on the site, as XML."),
      link(
        "GitHub",
        "https://github.com/aviralj02",
        "Source for this site and most of the projects listed on it.",
      ),
      link(
        "LinkedIn",
        "https://linkedin.com/in/aviraljain02",
        "Roles and dates, in the formal form.",
      ),
    ].join("\n"),
  ]);
};
