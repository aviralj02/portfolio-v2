"use client";

import React, {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { buildEntries } from "@/lib/blogs";
import { cn } from "@/lib/utils";

type Props = {
  blogs: Blog[];
};

const BlogList = ({ blogs }: Props) => {
  const entries = useMemo(() => buildEntries(blogs), [blogs]);

  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);

  const links = useRef<Array<HTMLAnchorElement | null>>([]);
  const prefersReduced = useReducedMotion();

  const active = hovered ?? focused;

  const peekTransition = prefersReduced
    ? { duration: 0 }
    : {
        height: { type: "spring", stiffness: 420, damping: 40, mass: 0.6 },
        opacity: { duration: 0.18, ease: "easeOut" },
      };

  /* The listener lives on the window, not the list: until a row has focus,
     keydown never reaches the <ol>, so the shortcuts would be unreachable
     without tabbing in first. */
  useEffect(() => {
    const isTypingTarget = (target: EventTarget | null) => {
      const el = target as HTMLElement | null;

      return (
        !!el?.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(el?.tagName ?? "")
      );
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;

      /* Read the position off the DOM — `focused` still holds the previous
         value on the first keypress after a row takes focus. */
      const from = links.current.indexOf(
        document.activeElement as HTMLAnchorElement
      );

      if (event.key === "Escape") {
        if (from >= 0) links.current[from]?.blur();
        return;
      }

      const forward = event.key === "ArrowDown";
      const back = event.key === "ArrowUp";
      const jump = from >= 0 && (event.key === "Home" || event.key === "End");

      if (!forward && !back && !jump) return;
      /* Nothing selected yet: ↓ enters the list, ↑ leaves the page alone. */
      if (from < 0 && !forward) return;

      const last = entries.length - 1;
      const target =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? last
            : from < 0
              ? 0
              : from + (forward ? 1 : -1);

      const next = Math.min(Math.max(target, 0), last);
      /* At either edge, release the key so the page scrolls as usual. */
      if (next === from) return;

      event.preventDefault();

      const link = links.current[next];
      link?.focus({ preventScroll: true });
      link?.scrollIntoView({
        block: "nearest",
        behavior: prefersReduced ? "auto" : "smooth",
      });
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [entries.length, prefersReduced]);

  if (entries.length === 0) {
    return (
      <p className="border-t border-border pt-6 text-sm text-muted-foreground">
        Nothing published yet — new writing lands here first.
      </p>
    );
  }

  return (
    <ol
      className="-mx-3 sm:-mx-4"
      onMouseLeave={() => setHovered(null)}
    >
      {entries.map((entry, index) => {
        const isActive = active === index;
        const opensGroup = entry.startsYear && index > 0;

        /* The rules step aside around the active plate. */
        const showRule =
          index > 0 &&
          !entry.startsYear &&
          active !== index &&
          active !== index - 1;

        return (
          <Fragment key={entry.link}>
            {entry.startsYear && (
              <li
                aria-hidden
                className={cn(
                  "px-3 pb-2 text-xs font-medium tabular-nums text-muted-foreground/70 sm:hidden",
                  opensGroup && "pt-8"
                )}
              >
                {entry.year}
              </li>
            )}

            <li
              className={cn(
                "border-t transition-colors duration-200",
                showRule ? "border-border" : "border-transparent",
                opensGroup && "sm:mt-8"
              )}
            >
              <a
                ref={(node) => {
                  links.current[index] = node;
                }}
                href={entry.link}
                target="_blank"
                rel="noreferrer"
                aria-label={`${entry.title} — published ${entry.fullDate}, ${entry.readTime} minute read`}
                onMouseEnter={() => setHovered(index)}
                onFocus={() => setFocused(index)}
                onBlur={() => setFocused(null)}
                className={cn(
                  "group grid items-baseline gap-x-6 rounded-xl px-3 py-4 sm:px-4",
                  "grid-cols-[1fr_auto] sm:grid-cols-[3.5rem_1fr_auto]",
                  "outline-none ring-ring/50 transition-colors duration-200 focus-visible:ring-2",
                  isActive && "bg-accent"
                )}
              >
                <span
                  aria-hidden
                  className="hidden text-[13px] font-medium tabular-nums text-muted-foreground/70 sm:block"
                >
                  {entry.startsYear ? entry.year : ""}
                </span>

                <h2 className="min-w-0 text-[15px] font-medium leading-snug tracking-[-0.012em] text-primary sm:text-[17px]">
                  {entry.title}
                  <ArrowUpRight
                    aria-hidden
                    className={cn(
                      "ml-1 inline-block size-3.5 shrink-0 align-[-1px] text-muted-foreground",
                      "transition-all duration-200 ease-out",
                      isActive
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-1 opacity-0"
                    )}
                  />
                </h2>

                <div className="flex flex-col items-end gap-0.5 text-right">
                  <span className="text-[13px] tabular-nums text-muted-foreground">
                    {entry.month} {entry.day}
                  </span>

                  <span className="text-[11px] tabular-nums text-muted-foreground/60 sm:hidden">
                    {entry.readTime} min
                  </span>

                  {/* On desktop the read time is part of the peek, so resting rows stay one line tall. */}
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.span
                        key="read-time"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={peekTransition}
                        className="hidden overflow-hidden text-[11px] tabular-nums text-muted-foreground/60 sm:block"
                      >
                        {entry.readTime} min
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                <div className="col-span-2 min-w-0 sm:col-span-1 sm:col-start-2">
                  <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground sm:hidden">
                    {entry.summary}
                  </p>

                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        key="peek"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={peekTransition}
                        className="hidden overflow-hidden sm:block"
                      >
                        <p className="max-w-[68ch] pt-2 text-sm leading-relaxed text-muted-foreground">
                          {entry.summary}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </a>
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
};

export default BlogList;
