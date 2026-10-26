import { cn, formatDate } from "@/lib/utils";
import { MonthFormat } from "@/types/enums";

import Manuscript from "./blog-tile/manuscript";
import Ruled from "./blog-tile/ruled";
import StatusBadge from "./shared/status-badge";
import TileLabel from "./shared/tile-label";
import ExtraLinks from "./ExtraLinks";

type Props = {
  recentBlog: Blog | undefined;
  socials: Array<Social> | undefined;
};

const RecentBlogTile = ({ recentBlog, socials }: Props) => {
  const title = recentBlog?.title ?? "Blogs";
  const tags = recentBlog
    ? [
        formatDate(new Date(recentBlog.publishDate), MonthFormat.Short),
        `${recentBlog.readTime} min read`,
      ]
    : [];

  return (
    <div
      className={cn(
        "row-span-2 lg:order-1 order-2",
        "flex flex-col gap-3 lg:gap-4",
      )}
    >
      <div className="group relative flex-1 w-full min-h-64 rounded-2xl overflow-hidden card-template">
        <a
          href={recentBlog?.link || "/blogs"}
          target="_blank"
          rel="noreferrer"
          aria-label={recentBlog ? `${title}, my latest post` : "All posts"}
          className="absolute inset-0 z-10 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-secondary-text/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        />

        <Ruled />
        {recentBlog && (
          <>
            <StatusBadge label="Latest blog" />
            <Manuscript tags={tags} />
          </>
        )}

        <TileLabel title={title} />
      </div>

      <ExtraLinks socials={socials} />
    </div>
  );
};

export default RecentBlogTile;
