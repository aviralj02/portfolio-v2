"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import React from "react";

type Props = {
  recentProject: Project | undefined;
};

const RecentProjectTile = ({ recentProject }: Props) => {
  return (
    <motion.a
      whileHover={{
        scale: 1.02,
        y: -2,
      }}
      transition={{ duration: 0.1, ease: "easeOut" }}
      href={recentProject?.live || recentProject?.codebase || "/projects"}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "row-span-2 lg:order-7 order-6",
        "flex flex-col w-full justify-between rounded-2xl box-border p-3 sm:p-5 transition ease-in-out duration-200 card-template"
      )}
    >
      <div className="w-[10vw] h-[10vw] max-w-16 max-h-16 rounded-full grayscale-[50%] select-none">
        <img
          src={recentProject?.icon.url}
          alt={recentProject?.icon.fileName}
          className="rounded-full object-cover w-full h-full"
          draggable={false}
        />
      </div>

      <div className="flex flex-col gap-2 sm:gap-4 select-none">
        <span className="text-xs sm:text-sm">RECENT PROJECT</span>
        <h2 className="text-base sm:text-2xl font-bold">
          {recentProject?.title}
        </h2>
        <p className="text-xs sm:text-sm">{recentProject?.description}</p>
      </div>

      <ArrowRight className="w-5 h-5 sm:w-7 sm:h-7 self-end" />
    </motion.a>
  );
};

export default RecentProjectTile;
