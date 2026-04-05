"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { ArrowUpRight, Sparkles } from "lucide-react";
import { motion, useAnimation, useInView } from "motion/react";

import { cn } from "@/lib/utils";

const CraftsTile = () => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);

  const isInView = useInView(ref, { amount: "all" });
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia("(hover: none)").matches);
  }, []);

  useEffect(() => {
    if (!isTouch) return;

    controls.start(isInView ? "hover" : "rest");
  }, [isTouch, isInView, controls]);

  return (
    <motion.div
      ref={ref}
      className={cn(
        "col-span-2 order-5",
        "relative flex flex-col p-5 w-full bg-card rounded-2xl card-shadow overflow-hidden cursor-pointer"
      )}
      whileHover={isTouch ? undefined : "hover"}
      animate={isTouch ? controls : undefined}
      initial="rest"
    >
      <Link
        href="/craft"
        className="absolute inset-0 z-10"
        aria-label="View craft"
      />

      {/* gradient blobs */}
      <motion.div
        className="absolute lg:block hidden -top-12 -right-12 w-44 h-44 rounded-full bg-linear-to-br from-violet-500/20 to-sky-500/20 blur-3xl pointer-events-none"
        variants={{
          rest: { opacity: 0.5, scale: 1 },
          hover: { opacity: 1, scale: 1.15 },
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
      <motion.div
        className="absolute lg:block hidden -bottom-12 -left-12 w-44 h-44 rounded-full bg-linear-to-tr from-rose-500/20 to-emerald-500/20 blur-3xl pointer-events-none"
        variants={{
          rest: { opacity: 0.5, scale: 1 },
          hover: { opacity: 1, scale: 1.15 },
        }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
      />

      <div className="relative flex flex-col h-full justify-between gap-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <Sparkles
                className="w-3.5 h-3.5 text-secondary-text"
                fill="currentColor"
              />
              <span className="text-xs font-medium text-secondary-text uppercase tracking-widest">
                Explore
              </span>
            </div>
            <div className="relative overflow-hidden inline-block">
              <h2 className="text-2xl font-bold tracking-tight">Craft</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-snug">
              UI experiments, animations &amp; interactive demos
            </p>
          </div>
          <motion.div
            variants={{
              rest: { opacity: 0, x: -4, y: 4 },
              hover: { opacity: 1, x: 0, y: 0 },
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <ArrowUpRight className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </div>

        <div className="relative flex-1 overflow-hidden min-h-[80px] mist-edges">
          {/* Card 1 */}
          <motion.div
            className="absolute bottom-2 left-0 w-28 h-[76px] rounded-xl border border-violet-500/20 bg-linear-to-br from-violet-500/10 to-sky-500/10 p-3"
            variants={{
              rest: {
                rotate: -9,
                x: -10,
                y: 10,
                opacity: 0.55,
                filter: "grayscale(1)",
              },
              hover: {
                rotate: 6,
                x: 0,
                y: 0,
                opacity: 1,
                filter: "grayscale(0)",
              },
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="h-2 w-full rounded-full bg-linear-to-r from-violet-400 to-sky-400 mb-2" />
            <motion.div
              className="h-1.5 rounded-full bg-violet-400/30 mb-1.5"
              variants={{ rest: { width: "75%" }, hover: { width: "100%" } }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
            />
            <motion.div
              className="h-1.5 rounded-full bg-sky-400/30 mb-1.5"
              variants={{ rest: { width: "50%" }, hover: { width: "70%" } }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.12 }}
            />
            <motion.div
              className="h-1.5 rounded-full bg-violet-400/20"
              variants={{ rest: { width: "67%" }, hover: { width: "45%" } }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.19 }}
            />
          </motion.div>

          {/* Card 2 */}
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-[88px] rounded-xl border border-border bg-card shadow-md p-3 flex flex-col gap-2"
            variants={{
              rest: { rotate: 2, y: 16, opacity: 0.7, filter: "grayscale(1)" },
              hover: { rotate: 1, y: 4, opacity: 1, filter: "grayscale(0)" },
            }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
          >
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-rose-400/70" />
              <div className="w-2 h-2 rounded-full bg-amber-400/70" />
              <div className="w-2 h-2 rounded-full bg-emerald-400/70" />
            </div>
            <div className="flex-1 flex items-center justify-center relative">
              <motion.div
                className="absolute w-8 h-8 rounded-full border border-rose-400/50"
                variants={{
                  rest: { scale: 1, opacity: 0 },
                  hover: { scale: 2, opacity: [0, 0.5, 0] },
                }}
                transition={{ duration: 0.65, ease: "easeOut", delay: 0.1 }}
              />

              <motion.div
                className="absolute w-8 h-8 rounded-full border border-emerald-400/40"
                variants={{
                  rest: { scale: 1, opacity: 0 },
                  hover: { scale: 2.4, opacity: [0, 0.4, 0] },
                }}
                transition={{ duration: 0.75, ease: "easeOut", delay: 0.22 }}
              />

              <motion.div
                className="w-8 h-8 rounded-full bg-linear-to-br from-rose-400/60 to-emerald-400/60"
                variants={{
                  rest: { scale: 1 },
                  hover: { scale: 1.22 },
                }}
                transition={{ duration: 0.35, ease: "easeOut", delay: 0.08 }}
              />
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            className="absolute bottom-2 right-0 w-28 h-[76px] rounded-xl border border-emerald-500/20 bg-linear-to-br from-rose-500/10 to-emerald-500/10 p-3"
            variants={{
              rest: {
                rotate: 9,
                x: 10,
                y: 10,
                opacity: 0.55,
                filter: "grayscale(1)",
              },
              hover: {
                rotate: -6,
                x: 0,
                y: 0,
                opacity: 1,
                filter: "grayscale(0)",
              },
            }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                {/* toggle: OFF at rest → ON on hover */}
                <motion.div
                  className="w-7 h-3.5 rounded-full relative flex items-center px-0.5"
                  variants={{
                    rest: { backgroundColor: "rgba(156,163,175,0.35)" },
                    hover: { backgroundColor: "rgba(52,211,153,0.35)" },
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut", delay: 0.15 }}
                >
                  <motion.div
                    className="w-2.5 h-2.5 rounded-full absolute left-[2px]"
                    variants={{
                      rest: { x: 0, backgroundColor: "rgb(156,163,175)" },
                      hover: { x: 14, backgroundColor: "rgb(16,185,129)" },
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                      delay: 0.15,
                    }}
                  />
                </motion.div>

                <div className="relative w-5 h-3 overflow-hidden">
                  <motion.span
                    className="absolute inset-0 text-[8px] font-semibold tracking-wide text-muted-foreground"
                    variants={{
                      rest: { y: 0, opacity: 1 },
                      hover: { y: -10, opacity: 0 },
                    }}
                    transition={{ duration: 0.2, delay: 0.15 }}
                  >
                    OFF
                  </motion.span>
                  <motion.span
                    className="absolute inset-0 text-[8px] font-semibold tracking-wide text-emerald-500"
                    variants={{
                      rest: { y: 10, opacity: 0 },
                      hover: { y: 0, opacity: 1 },
                    }}
                    transition={{ duration: 0.2, delay: 0.15 }}
                  >
                    ON
                  </motion.span>
                </div>
              </div>
              <div className="relative h-1.5 w-full rounded-full bg-rose-300/20">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-rose-400/50"
                  variants={{ rest: { width: "67%" }, hover: { width: "28%" } }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.18 }}
                />
              </div>

              <div className="relative h-1.5 w-full rounded-full bg-emerald-300/20">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-emerald-400/50"
                  variants={{ rest: { width: "33%" }, hover: { width: "80%" } }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.24 }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CraftsTile;
