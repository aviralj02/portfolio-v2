"use client";

import { motion, useReducedMotion } from "motion/react";

/* A text caret blinking at the end of the draft. */
const Caret = () => {
  const prefersReduced = useReducedMotion();

  return (
    <motion.span
      className="w-px h-2.5 bg-foreground/70"
      animate={prefersReduced ? undefined : { opacity: [1, 1, 0, 0] }}
      transition={{
        duration: 1.1,
        repeat: Infinity,
        times: [0, 0.5, 0.5, 1],
        ease: "linear",
      }}
    />
  );
};

export default Caret;
