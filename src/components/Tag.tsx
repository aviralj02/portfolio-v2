"use client";

import { useTheme } from "next-themes";
import React from "react";

type Props = {};

const Tag = (props: Props) => {
  const { theme } = useTheme();

  return (
    <div className="relative border-t shadow-inner border-dim py-[6px] px-5 rounded-xl text-xs md:text-sm overflow-hidden">
      <span className="z-10">JavaScript</span>
      {theme === "dark" ? (
        <div className="absolute bg-primary h-6 w-1/2 -z-10 rounded-full left-1/2 -bottom-6 transform -translate-x-1/2 blur-md" />
      ) : null}
    </div>
  );
};

export default Tag;
