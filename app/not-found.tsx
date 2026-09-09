import type { Metadata } from "next";
import { Link } from "next-view-transitions";

import PageWrapper from "@/components/PageWrapper";
import { STATIC_PAGE_PATHS } from "@/lib/agents/routes";

/**
 * The rendered 404. Agents asking for Markdown never reach it — `proxy.ts`
 * sends them to a Markdown recovery document instead — but the status code and
 * the list of somewhere-else-to-go are the same either way.
 */

export const metadata: Metadata = {
  title: "Not found | Aviral",
  robots: { index: false, follow: true },
};

const DESTINATIONS: Record<string, { label: string; note: string }> = {
  "/": { label: "Home", note: "The grid: about, socials, and what's playing." },
  "/work": {
    label: "Work",
    note: "Roles on a timeline, and the projects behind them.",
  },
  "/craft": {
    label: "Craft",
    note: "UI experiments and interaction studies, each with its source.",
  },
  "/blogs": {
    label: "Blogs",
    note: "Writing on tooling and the web platform.",
  },
  "/about": {
    label: "About",
    note: "Background, and how I work.",
  },
  "/contact": {
    label: "Contact",
    note: "How to reach me, and what to include.",
  },
  "/privacy": {
    label: "Privacy",
    note: "What this site collects, and who else sees it.",
  },
};

const NotFound = (): React.JSX.Element => {
  return (
    <PageWrapper className="flex flex-col gap-14">
      <header className="flex flex-col items-start gap-2 text-primary">
        <span className="text-xs font-medium uppercase tracking-widest text-secondary-text">
          404
        </span>

        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Nothing here
        </h1>

        <p className="w-full max-w-[58ch] text-pretty text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
          That path isn&apos;t a page on this site, and it never has been —
          nothing was moved. Everything there is to read is one of these.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground/70">
          Pages
        </h2>

        <ul className="flex w-full max-w-[62ch] flex-col">
          {STATIC_PAGE_PATHS.map((path) => (
            <li
              key={path}
              className="border-t border-border py-3 first:border-t-0 first:pt-0"
            >
              <Link href={path} className="font-medium text-primary">
                {DESTINATIONS[path].label}
              </Link>
              <p className="mt-1 max-w-[62ch] text-pretty text-sm text-muted-foreground">
                {DESTINATIONS[path].note}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground/70">
          For agents
        </h2>

        <p className="w-full max-w-[62ch] text-pretty text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
          Every page above is also served as Markdown — send{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[13px]">
            Accept: text/markdown
          </code>{" "}
          or append{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[13px]">
            .md
          </code>{" "}
          to the URL. The site overview lives in{" "}
          <a href="/llms.txt" className="text-primary underline-offset-4 hover:underline">
            llms.txt
          </a>{" "}
          and the full list of URLs in{" "}
          <a
            href="/sitemap.xml"
            className="text-primary underline-offset-4 hover:underline"
          >
            sitemap.xml
          </a>
          .
        </p>
      </section>
    </PageWrapper>
  );
};

export default NotFound;
