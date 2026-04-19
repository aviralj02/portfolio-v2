"use client";

import Link from "next/link";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

type Props = {
  craft: Craft;
};

const CraftCard = ({ craft }: Props) => {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      whileHover={prefersReduced ? {} : { y: -2 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="h-full"
    >
      <Link
        href={`/craft/${craft.slug}`}
        className={cn(
          "h-full flex flex-col gap-3 p-3 rounded-2xl",
          "bg-card border border-border",
          "transition-colors duration-200 hover:bg-accent"
        )}
      >
        <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden bg-secondary">
          {}
          <img
            src={craft.gif}
            alt={`${craft.title} preview`}
            className="w-full h-full object-cover"
            loading="lazy"
            draggable={false}
          />
        </div>

        <div className="flex flex-col gap-1 px-1 pb-1">
          <h2 className="text-sm font-semibold text-primary">{craft.title}</h2>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {craft.description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default CraftCard;
