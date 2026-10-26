import { useEffect, useState } from "react";

import { Globe, Images, Sparkle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import type { IllustrationProps } from "./types";

const MODES = [
  { icon: Sparkle, label: "Ask anything" },
  { icon: Images, label: "Imagine" },
  { icon: Globe, label: "Search web" },
];

const morph = { duration: 0.35, ease: [0.22, 1, 0.36, 1] } as const;

const QuickSwitch = ({ playing }: IllustrationProps) => {
  const [mode, setMode] = useState(0);

  useEffect(() => {
    if (!playing) return;

    const id = setInterval(() => setMode((m) => m + 1), 1300);
    return () => clearInterval(id);
  }, [playing]);

  const { icon: Icon, label } = MODES[mode % MODES.length];

  return (
    <div className="flex items-center gap-0.5 w-[88%] h-6 sm:h-7 p-0.5 rounded-full bg-muted shadow-[0_1px_2px_rgb(0_0_0/0.05),0_3px_10px_-3px_rgb(0_0_0/0.12)]">
      <span className="grid place-items-center h-full aspect-[1.3] rounded-full bg-background text-foreground shadow-[0_1px_2px_rgb(0_0_0/0.06),0_4px_12px_-4px_rgb(0_0_0/0.12)]">
        <AnimatePresence initial={false}>
          <motion.span
            key={mode}
            className="col-start-1 row-start-1"
            initial={{ opacity: 0, scale: 0.5, filter: "blur(3px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.5, filter: "blur(3px)" }}
            transition={morph}
          >
            <Icon
              className="size-3"
              strokeWidth={2.25}
              fill={Icon === Sparkle ? "currentColor" : "none"}
            />
          </motion.span>
        </AnimatePresence>
      </span>

      <span className="grid items-center flex-1 h-full min-w-0 overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.span
            key={mode}
            className="col-start-1 row-start-1 pl-1 text-[10px] text-muted-foreground whitespace-nowrap"
            initial={{ opacity: 0, y: 6, filter: "blur(2px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, filter: "blur(2px)" }}
            transition={morph}
          >
            {label}
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  );
};

export default QuickSwitch;
