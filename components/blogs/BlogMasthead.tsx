import { ArrowUpRight } from "lucide-react";

import BlogTitle from "./BlogTitle";

type Props = {
  count: number;
  span: string | null;
  mediumUrl?: string;
};

const Kbd = ({ children }: { children: React.ReactNode }) => (
  <kbd className="inline-flex min-w-4 items-center justify-center rounded border border-border px-1 font-sans text-[10px] leading-4">
    {children}
  </kbd>
);

/** The page's fixed half: title, scope, and where the writing actually lives. */
const BlogMasthead = ({
  count,
  span,
  mediumUrl,
}: Props): React.JSX.Element => {
  return (
    <div className="flex flex-col items-start gap-2 text-primary lg:sticky lg:top-8 lg:self-start">
      <span className="text-xs font-medium uppercase tracking-widest text-secondary-text">
        Writing
      </span>

      <BlogTitle />

      <p className="w-full max-w-[58ch] text-pretty text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
        Thoughts I couldn&apos;t stop thinking about, written down so you
        don&apos;t have to.
      </p>

      {span && (
        <div className="mt-6 flex w-full flex-col gap-1 border-t border-border pt-6 text-[13px] tabular-nums text-muted-foreground">
          <span>
            {count} {count === 1 ? "post" : "posts"}
          </span>
          <span>{span}</span>
        </div>
      )}

      {mediumUrl && (
        <a
          href={mediumUrl}
          target="_blank"
          rel="noreferrer"
          className="group mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-muted-foreground transition-colors duration-200 hover:text-primary"
        >
          Read on Medium
          <ArrowUpRight
            aria-hidden
            className="size-3.5 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </a>
      )}

      <p className="mt-8 hidden items-center gap-1.5 text-[11px] text-muted-foreground/50 lg:flex">
        <Kbd>↑</Kbd>
        <Kbd>↓</Kbd>
        <span>to browse</span>
        <span className="text-muted-foreground/30">·</span>
        <Kbd>↵</Kbd>
        <span>to open</span>
      </p>
    </div>
  );
};

export default BlogMasthead;
