"use client";

import { cn, formatDate } from "@/lib/utils";
import { MonthFormat } from "@/types/enums";
import { ArrowRight } from "lucide-react";
import React from "react";
import ExtraLinks from "./ExtraLinks";

type Props = {
  recentBlog: Blog | undefined;
  socials: Array<Social> | undefined;
};

const RecentBlogTile = ({ recentBlog, socials }: Props) => {
  return (
    <div
      className={cn(
        "row-span-2 lg:order-1 order-2",
        "flex flex-col gap-4 lg:gap-7"
      )}
    >
      <a
        href={recentBlog?.link || "/blogs"}
        target="_blank"
        rel="noreferrer"
        className={
          "flex flex-col flex-1 w-full items-start justify-end gap-12 sm:gap-20 box-border bg-card p-3 sm:p-5 rounded-2xl hover:bg-accent transition ease-in-out duration-200"
        }
      >
        <div className="flex flex-col gap-4">
          <span className="text-xs sm:text-sm">RECENT BLOG</span>
          <h2 className="text-sm sm:text-xl font-bold">{recentBlog?.title}</h2>
          <span className="text-xs sm:text-sm">
            {formatDate(new Date(recentBlog?.publishDate!), MonthFormat.Long)}
          </span>
        </div>

        <ArrowRight className="w-5 h-5 sm:w-7 sm:h-7 self-end" />
      </a>

      <ExtraLinks socials={socials} />
    </div>
  );
};

export default RecentBlogTile;
