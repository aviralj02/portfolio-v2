"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { ChevronRight, ExternalLink } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { markdownComponents } from "@/lib/markdown-components";
import { cn } from "@/lib/utils";
import { TagSize } from "@/types/enums";

import GithubIcon from "../icons/GithubIcon";
import Modal from "../Modal";
import Tag from "../Tag";

type Props = {
  project: Project;
};

const ProjectCard = ({ project }: Props) => {
  const {
    icon,
    backgroundColor,
    codebase,
    live,
    title,
    description,
    stack,
    with: team,
    intro,
  } = project;

  const [isOpen, setIsOpen] = useState(false);
  const prefersReduced = useReducedMotion();

  const iconId = `project-icon-${title}`;

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className={cn(
          "w-full flex items-center gap-3 p-3 rounded-2xl text-left",
          "bg-card border border-border",
          "cursor-pointer group"
        )}
        whileHover={prefersReduced ? {} : { x: 4 }}
        whileTap={prefersReduced ? {} : { scale: 0.985 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        <div
          className="w-1 self-stretch rounded-full shrink-0 opacity-35 mask-[linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]"
          style={{ backgroundColor }}
        />

        {!isOpen ? (
          <motion.div
            layoutId={iconId}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-border shrink-0"
            transition={{ type: "spring", stiffness: 300, damping: 40 }}
          >
            {icon?.url && (
              <Image
                src={icon.url}
                alt={icon.fileName ?? title}
                width={64}
                height={64}
                className="object-cover w-full h-full"
                sizes="64px"
                draggable={false}
              />
            )}
          </motion.div>
        ) : (
          <div className="w-10 h-10 shrink-0" aria-hidden />
        )}

        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
          <h2 className="text-sm font-semibold text-primary">{title}</h2>
          <p className="text-xs text-muted-foreground truncate">{intro}</p>
        </div>

        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
      </motion.button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div
          className="h-20 shrink-0 rounded-t-3xl sm:rounded-t-3xl overflow-hidden"
          style={{ backgroundColor }}
        />

        {icon?.url && (
          <div className="px-6 -mt-8 shrink-0">
            <motion.div
              layoutId={iconId}
              className="size-16 rounded-full overflow-hidden border-4 border-card shadow-lg"
              transition={{ type: "spring", stiffness: 300, damping: 40 }}
            >
              <Image
                src={icon.url}
                alt={icon.fileName ?? title}
                width={64}
                height={64}
                className="object-cover w-full h-full"
                sizes="64px"
                draggable={false}
                loading="eager"
              />
            </motion.div>
          </div>
        )}

        <div className="flex items-start justify-between gap-3 px-6 pt-3 shrink-0">
          <motion.h2
            className="text-xl font-bold text-primary leading-snug"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {title}
          </motion.h2>

          <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
            {codebase && (
              <Link
                href={codebase}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Source code"
                className="p-2 rounded-xl bg-secondary hover:bg-muted text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <GithubIcon className="h-4 w-4" />
              </Link>
            )}
            {live && (
              <Link
                href={live}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Live project"
                className="p-2 rounded-xl bg-secondary hover:bg-muted text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-5 px-6 pt-3 pb-8 rounded-b-3xl sm:rounded-b-3xl">
          <motion.div
            className="scrollbar overflow-y-auto max-h-[180px] pr-1 text-sm text-muted-foreground leading-relaxed"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14, duration: 0.28, ease: "easeOut" }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {description}
            </ReactMarkdown>
          </motion.div>

          {stack?.length > 0 && (
            <motion.div
              className="flex flex-col gap-3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.28, ease: "easeOut" }}
            >
              <span className="text-xs font-medium tracking-widest uppercase text-secondary-text">
                Stack
              </span>
              <ul className="flex gap-2 flex-wrap" aria-label="Technologies">
                {stack.map((tech) => (
                  <li key={tech}>
                    <Tag name={tech} size={TagSize.Small} />
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {team?.length > 0 && (
            <motion.div
              className="flex flex-col gap-3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.28, ease: "easeOut" }}
            >
              <span className="text-xs font-medium tracking-widest uppercase text-secondary-text">
                With
              </span>

              <ul className="flex gap-2 flex-wrap">
                {team.map(({ name, href }) => (
                  <li key={name}>
                    <Link
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary hover:bg-muted text-xs font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      <span
                        className="size-2 rounded-full shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.34,1.8,0.5,1)] group-hover:scale-120"
                        style={{ backgroundColor }}
                        aria-hidden
                      />

                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ProjectCard;
