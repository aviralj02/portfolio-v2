/**
 * The set of paths this site actually serves, in one place.
 *
 * Two callers need it. The proxy has to tell a real page from a typo before
 * Next's router does, so it can decide whether a Markdown request is a
 * document or a 404. The Markdown route handler uses the same list to build
 * the recovery links. `tests/routes.test.ts` keeps it honest against the app
 * directory.
 */

/** Pages with a fixed path, in the order an agent should walk them. */
export const STATIC_PAGE_PATHS = [
  "/",
  "/work",
  "/craft",
  "/blogs",
  "/about",
  "/contact",
  "/privacy",
] as const;

/** Machine-readable files that live outside the router. */
export const AGENT_FILE_PATHS = [
  "/llms.txt",
  "/sitemap.xml",
  "/robots.txt",
] as const;

/** `/work/` and `/work` are the same page; `/` stays `/`. */
export const normalizePagePath = (pathname: string): string => {
  const trimmed = pathname.replace(/\/+$/, "");

  return trimmed === "" ? "/" : trimmed;
};

export const isKnownPagePath = (
  pathname: string,
  craftSlugs: readonly string[],
): boolean => {
  const path = normalizePagePath(pathname);

  if ((STATIC_PAGE_PATHS as readonly string[]).includes(path)) return true;

  const craft = path.match(/^\/craft\/([^/]+)$/);

  return craft !== null && craftSlugs.includes(craft[1]);
};

/**
 * The sibling Markdown URL for a page, following the llms.txt convention: the
 * extension is appended, and a path with no filename gets `index.md`.
 */
export const markdownPathFor = (pathname: string): string => {
  const path = normalizePagePath(pathname);

  return path === "/" ? "/index.md" : `${path}.md`;
};

/** The inverse, or `null` when the path is not a Markdown sibling. */
export const pagePathForMarkdown = (pathname: string): string | null => {
  if (!pathname.endsWith(".md")) return null;

  const stripped = pathname.slice(0, -".md".length);

  if (stripped === "/index") return "/";
  if (stripped === "" || stripped === "/") return null;

  return normalizePagePath(stripped);
};
