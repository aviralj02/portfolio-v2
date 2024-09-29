import { TagSize } from "@/types/enums";
import dynamic from "next/dynamic";
import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

const Tag = dynamic(() => import("../Tag"), { ssr: false });
const GithubIcon = dynamic(() => import("../icons/GithubIcon"), { ssr: false });

type Props = {
  project: Project;
};

const ProjectCard = ({ project }: Props) => {
  return (
    <div
      style={{ backgroundColor: project.backgroundColor }}
      className="relative flex flex-col w-full rounded-3xl h-fit"
    >
      <div className="bg-transparent h-14 w-full" />

      {/* ICON */}
      <div className="absolute top-5 left-5 w-[20vw] h-[20vw] max-w-20 max-h-20 rounded-full z-20 border-[6px] border-card">
        <img
          src={project.icon?.url}
          alt={project.icon?.fileName}
          className="rounded-full object-cover w-full h-full"
        />
      </div>

      {/* PROJECT DETAILS */}
      <div className="bg-card flex flex-col gap-6 w-full p-5 rounded-3xl z-10">
        <div className="flex items-center gap-3 rounded-full w-fit self-end">
          {project.codebase && (
            <Link href={project.codebase} target="_blank" rel="noreferrer">
              <GithubIcon className="h-5 w-5" />
            </Link>
          )}
          {project.live && (
            <Link href={project.live} target="_blank" rel="noreferrer">
              <ExternalLink className="h-5 w-5" />
            </Link>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xl sm:text-2xl font-semibold">{project.title}</h2>

          <p className="text-sm sm:text-base font-normal text-muted-foreground">
            {project.description}
          </p>

          <div className="flex gap-2 flex-wrap mt-2">
            {project.stack.map((tech: string) => (
              <Tag key={tech} name={tech} size={TagSize.Small} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
