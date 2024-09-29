"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import React, { FC, ReactElement } from "react";

type Props = {
  className?: string;
};

const ResumeIcon: FC<Props> = ({ className }: Props): ReactElement => {
  const { theme } = useTheme();

  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <title>Resume</title>
      <path
        fill={theme === "light" ? "black" : "white"}
        d="M14.727 6.727H14V0H4.91c-.905 0-1.637.732-1.637 1.636v20.728c0 .904.732 1.636 1.636 1.636h14.182c.904 0 1.636-.732 1.636-1.636V6.727h-6zm-.545 10.455H7.09v-1.364h7.09v1.364zm2.727-3.273H7.091v-1.364h9.818v1.364zm0-3.273H7.091V9.273h9.818v1.363zM14.727 6h6l-6-6v6z"
      />
    </svg>
  );
};

export default ResumeIcon;
