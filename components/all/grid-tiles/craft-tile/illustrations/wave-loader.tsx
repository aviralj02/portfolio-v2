import { motion } from "motion/react";

import type { IllustrationProps } from "./types";

const WaveLoader = ({ playing }: IllustrationProps) => (
  <div className="flex items-center gap-1 h-7 sm:h-8 px-4 rounded-full bg-foreground text-background">
    {[0, 1, 2, 3, 4].map((i) => (
      <motion.span
        key={i}
        className="w-[3px] h-3 sm:h-3.5 rounded-full bg-current"
        animate={playing ? { scaleY: [0.35, 1, 0.35] } : { scaleY: 0.6 }}
        transition={
          playing
            ? {
                duration: 0.9,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut",
              }
            : { duration: 0.3 }
        }
      />
    ))}
  </div>
);

export default WaveLoader;
