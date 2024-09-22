import { cn } from "@/lib/utils";
import { ArrowRight, RssIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {};

const RecentBlogTile = (props: Props) => {
  return (
    <div
      className={cn(
        "row-span-2 lg:order-1 order-2",
        "flex flex-col w-full items-start justify-end gap-12 sm:gap-20 box-border bg-card p-3 sm:p-5 rounded-2xl hover:bg-accent transition ease-in-out duration-200"
      )}
    >
      <div className="flex flex-col gap-4">
        <span className="text-xs sm:text-sm">LATEST BLOG</span>
        <h2 className="text-base sm:text-2xl font-bold">
          Setting up Express.js with Typescript
        </h2>
        <span className="text-xs sm:text-sm">September 20, 2024</span>
      </div>

      <ArrowRight className="w-5 h-5 sm:w-7 sm:h-7 self-end" />
    </div>
  );
};

export default RecentBlogTile;
