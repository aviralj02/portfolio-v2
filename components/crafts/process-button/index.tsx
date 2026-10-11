"use client";

import { useEffect, useId, useState } from "react";

import { ArrowDown, Check, X } from "lucide-react";
import {
  animate,
  AnimatePresence,
  motion,
  MotionConfig,
  useMotionValue,
} from "motion/react";

type Status = "idle" | "running" | "done";

const SUFFIX: Record<Status, string> = {
  idle: "e",
  running: "ing",
  done: "ed",
};

const SPRING = { type: "spring", bounce: 0.3, duration: 0.7 } as const;

const DURATION = 4;
const SLOT = 50;

export default function ProcessButton() {
  const [status, setStatus] = useState<Status>("idle");
  const progress = useMotionValue(0);
  const gooId = useId();
  const [hovered, setHovered] = useState(false);
  const running = status === "running";
  const slot = running ? SLOT : 0;

  useEffect(() => {
    if (status === "running") {
      const controls = animate(progress, 1, {
        duration: DURATION,
        ease: "linear",
        onComplete: () => setStatus("done"),
      });
      return () => controls.stop();
    }
    if (status === "done") {
      const timeout = window.setTimeout(() => setStatus("idle"), 1600);
      return () => window.clearTimeout(timeout);
    }
    animate(progress, 0, { duration: 0.35, ease: "easeOut" });
  }, [status, progress]);

  return (
    <MotionConfig reducedMotion="user" transition={SPRING}>
      <div className="flex w-full grow flex-col items-center justify-center gap-6">
        <svg aria-hidden className="absolute size-0">
          <filter id={gooId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
            <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" />
          </filter>
        </svg>

        <motion.div
          whileTap={{ scale: 0.97 }}
          className="relative flex h-10 items-center"
        >
          <div
            aria-hidden
            style={{ filter: `url(#${gooId})` }}
            className="absolute inset-0 flex"
          >
            <div className="flex-1 rounded-full bg-foreground" />
            <motion.div
              initial={false}
              animate={{ width: slot }}
              className="relative"
            >
              <motion.div
                initial={false}
                animate={{ scale: running ? 1 : 0.7 }}
                className="absolute right-0 size-10 rounded-full bg-foreground"
              />
            </motion.div>
          </div>

          <button
            type="button"
            onClick={() => setStatus("running")}
            onPointerEnter={(e) =>
              e.pointerType === "mouse" && setHovered(true)
            }
            onPointerLeave={() => setHovered(false)}
            disabled={status !== "idle"}
            className="relative flex h-full cursor-pointer items-center gap-2 overflow-hidden rounded-full pr-4.5 pl-3.5 text-sm font-medium text-background outline-none select-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:cursor-default"
          >
            <motion.span
              initial={false}
              animate={{ opacity: running ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              style={{ scaleX: progress }}
              className="absolute inset-0 origin-left bg-background/20"
            />

            <span className="relative grid size-4 place-items-center overflow-hidden">
              <AnimatePresence initial={false}>
                <motion.span
                  key={status === "done" ? "check" : "arrow"}
                  initial={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
                  transition={{ duration: 0.2 }}
                  className="col-start-1 row-start-1"
                >
                  {status === "done" ? (
                    <Check className="size-4" strokeWidth={2.5} />
                  ) : (
                    // Drops through its box once on hover, then keeps
                    // falling for as long as the update runs.
                    <motion.span
                      animate={{
                        y: running
                          ? ["-130%", "130%"]
                          : hovered && status === "idle"
                            ? [0, "130%", "-130%", 0]
                            : 0,
                      }}
                      transition={
                        running
                          ? {
                              duration: 0.9,
                              ease: "easeInOut",
                              repeat: Infinity,
                            }
                          : hovered
                            ? { duration: 0.5, times: [0, 0.5, 0.5, 1] }
                            : { duration: 0.2 }
                      }
                      className="block"
                    >
                      <ArrowDown className="size-4" strokeWidth={2.5} />
                    </motion.span>
                  )}
                </motion.span>
              </AnimatePresence>
            </span>

            <span className="relative flex">
              Updat
              {Object.entries(SUFFIX).map(([key, suffix]) => (
                <motion.span
                  key={key}
                  initial={false}
                  animate={
                    key === status
                      ? { width: "auto", opacity: 1, filter: "blur(0px)" }
                      : { width: 0, opacity: 0, filter: "blur(3px)" }
                  }
                  className="overflow-hidden"
                >
                  {suffix}
                </motion.span>
              ))}
            </span>
          </button>

          <motion.div
            initial={false}
            animate={{ width: slot }}
            className="relative h-full"
          >
            <motion.button
              type="button"
              onClick={() => setStatus("idle")}
              disabled={!running}
              aria-label="Stop updating"
              initial={false}
              animate={{ opacity: running ? 1 : 0, scale: running ? 1 : 0.7 }}
              whileTap={{ scale: 0.9 }}
              className="group absolute right-0 grid size-10 cursor-pointer place-items-center rounded-full text-background outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:pointer-events-none"
            >
              <X
                className="size-4 transition-transform duration-300 group-hover:rotate-90"
                strokeWidth={2.5}
              />
            </motion.button>
          </motion.div>

          {/* Finishing sends one ring out from the pill. */}
          <AnimatePresence>
            {status === "done" && (
              <motion.span
                initial={{ inset: 0, opacity: 0.5 }}
                animate={{ inset: -10, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-none absolute rounded-full border border-foreground"
              />
            )}
          </AnimatePresence>

          <span role="status" className="sr-only">
            {status === "idle" ? "" : `Updat${SUFFIX[status]}`}
          </span>
        </motion.div>

        <p className="text-[11px] font-medium text-muted-foreground">
          Start it, then change your mind
        </p>
      </div>
    </MotionConfig>
  );
}
