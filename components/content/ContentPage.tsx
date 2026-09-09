import { Link } from "next-view-transitions";

import { ArrowUpRight } from "lucide-react";

import PageWrapper from "@/components/PageWrapper";
import type {
  ContentBlock,
  ContentLink,
  SitePage,
} from "@/lib/agents/site-content";

/**
 * The reading pages — About, Contact, Privacy — rendered from the same data
 * `lib/agents/markdown.ts` turns into Markdown, so the HTML a person sees and
 * the Markdown an agent asks for can never say different things.
 */

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** Read off the ISO string rather than through `Date`, as elsewhere on the
    site, so the server and the client never disagree about the timezone. */
const readableDate = (iso: string): string => {
  const [year, month, day] = iso.slice(0, 10).split("-").map(Number);

  return `${MONTHS[month - 1]} ${day}, ${year}`;
};

const LinkRow = ({ item }: { item: ContentLink }): React.JSX.Element => {
  const label = (
    <span className="inline-flex items-center gap-1 font-medium text-primary">
      {item.label}
      {item.external && (
        <ArrowUpRight
          aria-hidden
          className="size-3.5 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      )}
    </span>
  );

  return (
    <li className="border-t border-border py-3 first:border-t-0 first:pt-0">
      {item.external ? (
        <a
          href={item.href}
          target="_blank"
          rel="noreferrer"
          className="group inline-block"
        >
          {label}
        </a>
      ) : (
        <Link href={item.href} className="group inline-block">
          {label}
        </Link>
      )}

      {item.note && (
        <p className="mt-1 max-w-[62ch] text-pretty text-sm text-muted-foreground">
          {item.note}
        </p>
      )}
    </li>
  );
};

const Block = ({ block }: { block: ContentBlock }): React.JSX.Element => {
  if (block.kind === "paragraph") {
    return (
      <p className="w-full max-w-[62ch] text-pretty text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
        {block.text}
      </p>
    );
  }

  if (block.kind === "list") {
    return (
      <ul className="flex w-full max-w-[62ch] flex-col gap-2">
        {block.items.map((item) => (
          <li
            key={item}
            className="relative pl-4 text-pretty text-sm leading-relaxed text-muted-foreground before:absolute before:left-0 before:top-[0.65em] before:size-1 before:rounded-full before:bg-muted-foreground/40 sm:text-[15px]"
          >
            {item}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="flex w-full max-w-[62ch] flex-col">
      {block.items.map((item) => (
        <LinkRow key={`${item.label}-${item.href}`} item={item} />
      ))}
    </ul>
  );
};

const ContentPage = ({ page }: { page: SitePage }): React.JSX.Element => {
  return (
    <PageWrapper className="flex flex-col gap-14">
      <header className="flex flex-col items-start gap-2 text-primary">
        <span className="text-xs font-medium uppercase tracking-widest text-secondary-text">
          {page.eyebrow}
        </span>

        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {page.title}
        </h1>

        <p className="w-full max-w-[58ch] text-pretty text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
          {page.summary}
        </p>

        {page.updated && (
          <p className="mt-2 text-[11px] uppercase tracking-widest text-muted-foreground/60">
            Last updated {readableDate(page.updated)}
          </p>
        )}
      </header>

      <div className="flex flex-col gap-12">
        {page.sections.map((section) => (
          <section key={section.heading} className="flex flex-col gap-4">
            <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground/70">
              {section.heading}
            </h2>

            {section.blocks.map((block, index) => (
              <Block key={`${section.heading}-${index}`} block={block} />
            ))}
          </section>
        ))}
      </div>
    </PageWrapper>
  );
};

export default ContentPage;
