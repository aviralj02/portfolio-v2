"use client";

import { cn } from "@/lib/utils";
import getProjects from "@/lib/utils/get-projects";
import { ArrowRight } from "lucide-react";
import React, { useEffect, useState } from "react";

const RecentProjectTile = () => {
  const [recentProject, setRecentProject] = useState<Project>();

  const fetchRecentProject = async () => {
    const projects = await getProjects();
    setRecentProject(projects?.[0]);
  };

  useEffect(() => {
    fetchRecentProject();
  }, []);

  return (
    <a
      href={recentProject?.live || recentProject?.codebase || "/projects"}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "row-span-2 lg:order-7 order-6",
        "flex flex-col w-full justify-between bg-card rounded-2xl box-border p-3 sm:p-5 hover:bg-accent transition ease-in-out duration-200"
      )}
    >
      <div className="w-[10vw] h-[10vw] max-w-16 max-h-16 rounded-full grayscale-[50%]">
        <img
          src={recentProject?.icon.url}
          alt={recentProject?.icon.fileName}
          className="rounded-full object-cover w-full h-full"
          draggable={false}
        />
      </div>

      <div className="flex flex-col gap-2 sm:gap-4">
        <span className="text-xs sm:text-sm">RECENT PROJECT</span>
        <h2 className="text-base sm:text-2xl font-bold">
          {recentProject?.title}
        </h2>
        <p className="text-xs sm:text-sm">{recentProject?.description}</p>
      </div>

      <ArrowRight className="w-5 h-5 sm:w-7 sm:h-7 self-end" />
    </a>
  );
};

export default RecentProjectTile;
