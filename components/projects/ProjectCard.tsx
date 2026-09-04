"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import Link from "next/link";

import { ExternalLink } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
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
          "group flex h-full w-full cursor-pointer items-start gap-3 rounded-xl p-4 text-left",
          "card-glass bg-card/50 hover:card-glass-lift",
          "transition-[box-shadow,background-color] duration-200 hover:bg-card",
        )}
        whileTap={prefersReduced ? {} : { scale: 0.99 }}
        transition={{ duration: 0.12, ease: "easeOut" }}
      >
        {!isOpen ? (
          <motion.div
            layoutId={iconId}
            className="size-10 shrink-0 overflow-hidden rounded-[11px]"
            style={{ boxShadow: `0 0 0 1.5px ${backgroundColor}` }}
            transition={{ type: "spring", stiffness: 300, damping: 40 }}
          >
            {icon?.url && (
              <Image
                src={icon.url}
                alt=""
                width={80}
                height={80}
                sizes="80px"
                draggable={false}
                className={cn(
                  "size-full object-cover",
                  "transition-transform duration-300 ease-out group-hover:scale-[1.06]",
                  "motion-reduce:transition-none motion-reduce:group-hover:scale-100",
                )}
              />
            )}
          </motion.div>
        ) : (
          <div className="size-10 shrink-0" aria-hidden />
        )}

        <div className="flex min-w-0 flex-col gap-0.5">
          <h3 className="truncate text-sm font-medium tracking-[-0.01em] text-primary">
            {title}
          </h3>

          <p className="line-clamp-2 text-pretty text-[12.5px] leading-[1.45] text-muted-foreground">
            {intro}
          </p>
        </div>
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
