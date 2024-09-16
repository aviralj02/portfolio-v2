import { TagSize } from "@/types/enums";
import dynamic from "next/dynamic";
import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

const Tag = dynamic(() => import("../Tag"), { ssr: false });
const GithubIcon = dynamic(() => import("../icons/GithubIcon"), { ssr: false });

type Props = {
  project: ProjectType;
};

type ProjectType = {
  title: string;
  description: string;
  live?: string;
  github: string;
  banner: string;
  icon: string;
  stack: string[];
};

const ProjectCard = ({ project }: Props) => {
  return (
    <div
      style={{
        backgroundImage: `url(${project.banner})`,
      }}
      className="relative flex flex-col w-full rounded-3xl"
    >
      <div className="bg-transparent h-14 w-full" />

      {/* ICON */}
      <div className="absolute top-5 left-5 w-20 h-20 rounded-full z-20 border-4 border-card">
        <img
          src={project.icon}
          alt="project-icon"
          className="rounded-full object-cover"
        />
      </div>

      {/* PROJECT DETAILS */}
      <div className="bg-card flex flex-col gap-6 w-full p-5 rounded-3xl z-10">
        <div className="flex items-center gap-3 rounded-full w-fit self-end">
          <Link href={"/"}>
            <GithubIcon width={20} height={20} />
          </Link>
          <Link href={"/"}>
            <ExternalLink width={20} height={20} />
          </Link>
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
