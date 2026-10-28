"use client";

import { motion, useReducedMotion } from "motion/react";

type Props = {
  label: string;
};

/* Says what the tile is pointing at: a small glass pill whose dot breathes
   like a live indicator. */
const StatusBadge = ({ label }: Props) => {
  const prefersReduced = useReducedMotion();

  return (
    <span className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-1.5 rounded-full bg-card card-glass px-2 py-1 text-[10px] sm:text-[11px] font-medium text-muted-foreground pointer-events-none">
      <span className="relative grid place-items-center size-1.5">
        {!prefersReduced && (
          <motion.span
            aria-hidden
            className="col-start-1 row-start-1 size-1.5 rounded-full bg-emerald-500"
            animate={{ scale: [1, 2.6], opacity: [0.5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <span className="col-start-1 row-start-1 size-1.5 rounded-full bg-emerald-500" />
      </span>
      {label}
    </span>
  );
};

export default StatusBadge;
