"use client";

import { cn, formatDate } from "@/lib/utils";
import getBlogs from "@/lib/utils/get-blogs";
import { MonthFormat } from "@/types/enums";
import { ArrowRight } from "lucide-react";
import React, { useEffect, useState } from "react";

type Props = {
  recentBlog: Blog | undefined;
};

const RecentBlogTile = ({ recentBlog }: Props) => {
  return (
    <a
      href={recentBlog?.link || "/blogs"}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "row-span-2 lg:order-1 order-2",
        "flex flex-col w-full items-start justify-end gap-12 sm:gap-20 box-border bg-card p-3 sm:p-5 rounded-2xl hover:bg-accent transition ease-in-out duration-200"
      )}
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
  );
};

export default RecentBlogTile;
