"use client";

import { useId, useState } from "react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";

import { ArrowUpRight } from "lucide-react";
import { motion, MotionConfig } from "motion/react";
import remarkGfm from "remark-gfm";

import { markdownComponents } from "@/lib/markdown-components";
import { cn } from "@/lib/utils";

import GithubIcon from "../icons/GithubIcon";
import Modal from "../Modal";

import Signal from "./signal";

type Props = {
  project: Project;
};

const morph = { type: "spring", stiffness: 300, damping: 40 } as const;

/* Each block of the open project enters in turn: opacity, a little blur and
   a short rise. Under reduced motion MotionConfig drops the rise. */
const enter = (i: number) => ({
  initial: { opacity: 0, y: 12, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { delay: 0.1 * i, duration: 0.3, ease: "easeOut" },
}) as const;

const CHIP =
  "whitespace-nowrap rounded-full bg-card card-glass px-2.5 py-1 text-xs font-medium text-muted-foreground";

const ACTION =
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-[background-color,color,scale] duration-150 ease-out motion-safe:active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-text/60";

/* The project's icon, in its brand ring on the card. Shares a layoutId
   between the card and the dialog so it travels from one to the other.
   Positioned so it always paints above the dialog header's backdrop: while
   it flies its transform lifts it, and without `relative` it would drop
   behind the backdrop the moment it lands. */
const Icon = ({
  project,
  layoutId,
  className,
  ring = true,
  hoverZoom = false,
}: {
  project: Project;
  layoutId: string;
  className: string;
  ring?: boolean;
  /** Nudges the artwork up when the card around it is hovered. */
  hoverZoom?: boolean;
}) => (
  <motion.div
    layoutId={layoutId}
    transition={morph}
    className={cn(
      "relative col-start-1 row-start-1 overflow-hidden rounded-[22%] bg-card",
      className,
    )}
    style={{
      boxShadow: `0 0 0 1.5px ${ring ? (project.backgroundColor ?? "transparent") : "transparent"}, 0 6px 14px -6px rgb(0 0 0 / 0.35)`,
    }}
  >
    {project.icon?.url && (
      <Image
        src={project.icon.url}
        alt=""
        width={128}
        height={128}
        sizes="64px"
        draggable={false}
        className={cn(
          "size-full object-cover",
          hoverZoom &&
            "transition-transform duration-300 ease-out group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100",
        )}
      />
    )}
  </motion.div>
);

const ProjectCard = ({ project }: Props) => {
  const { codebase, live, title, description, stack, with: team, intro } =
    project;

  const [isOpen, setIsOpen] = useState(false);

  const id = useId();
  const iconId = `project-icon-${id}`;
  const titleId = `project-title-${id}`;
  const introId = `project-intro-${id}`;
  const dialogTitleId = `project-dialog-title-${id}`;

  return (
    <MotionConfig reducedMotion="user">
      <motion.button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-labelledby={titleId}
        aria-describedby={introId}
        className={cn(
          "group flex h-full w-full cursor-pointer items-start gap-3 rounded-xl p-4 text-left",
          "card-glass bg-card/50 hover:card-glass-lift",
          "transition-[box-shadow,background-color] duration-200 hover:bg-card",
          "outline-none focus-visible:ring-2 focus-visible:ring-secondary-text/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        )}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.12, ease: "easeOut" }}
      >
        <span aria-hidden className="grid size-10 shrink-0">
          {isOpen ? (
            <span className="col-start-1 row-start-1 size-10" />
          ) : (
            <Icon
              project={project}
              layoutId={iconId}
              className="size-10 rounded-[11px]"
              hoverZoom
            />
          )}
        </span>

        <span className="flex min-w-0 flex-col gap-0.5">
          <span
            id={titleId}
            className="truncate text-sm font-medium tracking-[-0.01em] text-primary"
          >
            {title}
          </span>
          <span
            id={introId}
            className="line-clamp-2 text-[12.5px] leading-[1.45] text-muted-foreground text-pretty"
          >
            {intro}
          </span>
        </span>
      </motion.button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        labelledBy={dialogTitleId}
      >
        <div aria-hidden className="relative grid h-32 shrink-0 place-items-center">
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Signal color={project.backgroundColor} />
          </motion.div>
          <Icon
            project={project}
            layoutId={iconId}
            className="size-14"
            ring={false}
          />
        </div>

        <div className="scrollbar flex flex-col gap-6 overflow-y-auto overscroll-contain px-6 pb-8">
          <motion.div className="flex flex-col gap-3" {...enter(0)}>
            <h2
              id={dialogTitleId}
              className="text-xl font-semibold leading-tight tracking-tight text-primary text-balance"
            >
              {title}
            </h2>

            {(live || codebase) && (
              <div className="flex flex-wrap gap-2">
                {live && (
                  <a
                    href={live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      ACTION,
                      "bg-primary text-primary-foreground hover:bg-primary/85",
                    )}
                  >
                    Visit site
                    <ArrowUpRight aria-hidden className="size-3.5" />
                  </a>
                )}
                {codebase && (
                  <a
                    href={codebase}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      ACTION,
                      "bg-secondary text-muted-foreground hover:bg-muted hover:text-primary",
                    )}
                  >
                    <span aria-hidden className="contents">
                      <GithubIcon className="size-3.5" />
                    </span>
                    View source
                  </a>
                )}
              </div>
            )}
          </motion.div>

          {description && (
            <motion.div
              className="text-sm leading-relaxed text-muted-foreground"
              {...enter(1)}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {description}
              </ReactMarkdown>
            </motion.div>
          )}

          {stack?.length > 0 && (
            <motion.section className="flex flex-col gap-2.5" {...enter(2)}>
              <h3 className="text-xs font-medium text-secondary-text">Stack</h3>
              <ul className="flex flex-wrap gap-1.5">
                {stack.map((tech) => (
                  <li key={tech} className={CHIP}>
                    {tech}
                  </li>
                ))}
              </ul>
            </motion.section>
          )}

          {team?.length > 0 && (
            <motion.section className="flex flex-col gap-2.5" {...enter(3)}>
              <h3 className="text-xs font-medium text-secondary-text">
                Built with
              </h3>
              <ul className="flex flex-wrap gap-1.5">
                {team.map(({ name, href }) => (
                  <li key={name}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        CHIP,
                        "inline-flex items-center gap-1.5 transition-colors duration-150 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-text/60",
                      )}
                    >
                      <span
                        aria-hidden
                        className="size-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: project.backgroundColor }}
                      />
                      {name}
                      <ArrowUpRight aria-hidden className="size-3" />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.section>
          )}
        </div>
      </Modal>
    </MotionConfig>
  );
};

export default ProjectCard;
