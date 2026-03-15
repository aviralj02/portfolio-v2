"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const bubbles = [
  { color: "#8b5cf6", size: 7, left: "6%", delay: 0, duration: 2.8 },
  { color: "#0ea5e9", size: 5, left: "18%", delay: 0.7, duration: 3.2 },
  { color: "#f43f5e", size: 6, left: "30%", delay: 1.4, duration: 2.6 },
  { color: "#10b981", size: 4, left: "44%", delay: 0.3, duration: 3.5 },
  { color: "#f59e0b", size: 8, left: "57%", delay: 1.1, duration: 2.9 },
  { color: "#a78bfa", size: 4, left: "70%", delay: 1.8, duration: 3.1 },
  { color: "#38bdf8", size: 6, left: "82%", delay: 0.5, duration: 2.7 },
  { color: "#fb7185", size: 5, left: "93%", delay: 1.3, duration: 3.3 },
];

const CraftsTile = () => {
  return (
    <motion.div
      className={cn(
        "col-span-2 order-5",
        "relative flex flex-col p-5 w-full bg-card rounded-2xl card-shadow overflow-hidden cursor-pointer"
      )}
      whileHover="hover"
      initial="rest"
    >
      <Link
        href="/craft"
        className="absolute inset-0 z-10"
        aria-label="View craft"
      />

      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.09) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
        variants={{
          rest: { x: 0, y: 0, opacity: 0.8 },
          hover: { x: -5, y: -5, opacity: 1 },
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />

      {/* gradient blobs */}
      <motion.div
        className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-linear-to-br from-violet-500/20 to-sky-500/20 blur-3xl pointer-events-none"
        variants={{
          rest: { opacity: 0.5, scale: 1 },
          hover: { opacity: 1, scale: 1.15 },
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
      <motion.div
        className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-linear-to-tr from-rose-500/20 to-emerald-500/20 blur-3xl pointer-events-none"
        variants={{
          rest: { opacity: 0.5, scale: 1 },
          hover: { opacity: 1, scale: 1.15 },
        }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
      />

      <div className="relative flex flex-col h-full justify-between gap-5">
        {/* Header */}
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

        {/* Bubbling lab animation */}
        <div className="relative h-full overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-full bg-linear-to-t to-transparent pointer-events-none" />
          {bubbles.map((bubble, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: bubble.size,
                height: bubble.size,
                left: bubble.left,
                bottom: 2,
                backgroundColor: bubble.color,
                filter: "blur(0.5px)",
              }}
              animate={{
                y: [0, -(48 + bubble.size)],
                opacity: [0, 0.75, 0],
                scale: [0.7, 1, 0.85],
              }}
              transition={{
                duration: bubble.duration,
                delay: bubble.delay,
                repeat: Infinity,
                ease: "easeOut",
                repeatDelay: 0.4,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CraftsTile;
