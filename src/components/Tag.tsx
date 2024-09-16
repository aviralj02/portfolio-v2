"use client";

import { cn } from "@/lib/utils";
import { TagSize } from "@/types/enums";
import { useTheme } from "next-themes";
import React from "react";

type Props = {
  name: string;
  size: TagSize;
};

const Tag = ({ name, size }: Props) => {
  const { theme } = useTheme();

  return (
    <div
      className={cn(
        size === TagSize.Small
          ? "text-[10px] md:text-xs"
          : "text-xs md:text-sm",
        "relative border-t shadow-inner border-dim py-[6px] px-5 rounded-xl overflow-hidden tracking-wide select-none bg-background -z-20"
      )}
    >
      <span className="z-10">{name}</span>
      {theme === "dark" ? (
        <div className="absolute bg-primary h-6 w-1/2 rounded-full left-1/2 -bottom-6 transform -translate-x-1/2 blur-md" />
      ) : null}
    </div>
  );
};

export default Tag;
