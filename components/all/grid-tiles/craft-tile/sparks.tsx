import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

import { SPARKS } from "./constants";

const Sparks = () => {
  const prefersReduced = useReducedMotion();

  return SPARKS.map((position, i) => (
    <motion.span
      key={position}
      aria-hidden
      className={cn(
        "absolute size-2 pointer-events-none text-muted-foreground",
        position,
      )}
      variants={{
        rest: prefersReduced
          ? { opacity: 0.35 }
          : {
              opacity: [0.15, 0.7, 0.15],
              transition: {
                duration: 2.6,
                repeat: Infinity,
                delay: i * 0.5,
              },
            },
        active: { opacity: 0, transition: { duration: 0.2 } },
      }}
    >
      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
      <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current" />
    </motion.span>
  ));
};

export default Sparks;
