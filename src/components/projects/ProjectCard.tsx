"use client";

import Image from "next/image";
import Link from "next/link";

import { ExternalLink } from "lucide-react";

import { cn } from "@/lib/utils";
import { TagSize } from "@/types/enums";

import GithubIcon from "../icons/GithubIcon";
import Tag from "../Tag";

type Props = {
  project: Project;
};

const ProjectCard = ({ project }: Props) => {
  const { icon, backgroundColor, codebase, live, title, description, stack } =
    project;

  return (
    <article
      className={cn(
        "relative flex flex-col w-full rounded-3xl h-full overflow-hidden card-shadow",
        "transition-all duration-300 ease-out"
      )}
      style={{ backgroundColor }}
    >
      <div className="min-h-14 w-full shrink-0" aria-hidden />

      {/* Project icon */}
      <div className="absolute top-5 left-5 z-20 w-[20vw] h-[20vw] max-w-20 max-h-20 rounded-full overflow-hidden border-[6px] border-card bg-card shadow-sm">
        {icon?.url && (
          <Image
            src={icon.url}
            alt={icon.fileName ?? title}
            width={80}
            height={80}
            className="object-cover w-full h-full"
            sizes="80px"
            draggable={false}
          />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-6 w-full h-full p-5 rounded-3xl -mt-3 bg-card">
        {/* Actions */}
        <div
          className="flex items-center gap-2 w-fit self-end"
          role="group"
          aria-label="Project links"
        >
          {codebase && (
            <Link
              href={codebase}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View source code on GitHub"
              className={cn(
                "p-1.5 rounded-lg text-muted-foreground",
                "transition-colors duration-200",
                "hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              )}
            >
              <GithubIcon className="h-5 w-5" />
            </Link>
          )}

          {live && (
            <Link
              href={live}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open live project"
              className={cn(
                "p-1.5 rounded-lg text-muted-foreground",
                "transition-colors duration-200",
                "hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              )}
            >
              <ExternalLink className="h-5 w-5" />
            </Link>
          )}
        </div>

        <div className="flex flex-col gap-4 justify-evenly min-w-0 flex-1">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-primary leading-tight">
              {title}
            </h2>

            <p className="text-sm sm:text-base font-normal text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>

          {stack?.length > 0 && (
            <ul className="flex gap-2 flex-wrap" aria-label="Technologies">
              {stack.map((tech) => (
                <li key={tech}>
                  <Tag name={tech} size={TagSize.Small} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
