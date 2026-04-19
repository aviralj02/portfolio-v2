"use client";

import { useRef, useState } from "react";

import { Minus, Plus } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "motion/react";

const variants: Variants = {
  enter: (dir: number) => ({ y: dir * 40, opacity: 0 }),
  center: { y: 0, opacity: 1 },
  exit: (dir: number) => ({ y: dir * -40, opacity: 0 }),
};

export default function SpringCounter() {
  const [count, setCount] = useState(0);
  const directionRef = useRef<1 | -1>(1);

  const bump = (delta: 1 | -1) => {
    directionRef.current = delta;
    setCount((c) => c + delta);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 min-h-[320px] max-w-40 w-full">
      <div className="relative h-20 w-24 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false} custom={directionRef.current}>
          <motion.span
            key={count}
            custom={directionRef.current}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className="absolute text-6xl font-bold tabular-nums text-primary"
          >
            {count}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-3 w-full">
        <motion.button
          onClick={() => bump(-1)}
          whileTap={{ scale: 0.9 }}
          className="p-3 rounded-lg w-full flex items-center hover:bg-primary/70 justify-center cursor-pointer bg-primary text-primary transition-colors"
          aria-label="Decrement"
        >
          <Minus className="size-4 text-primary-foreground" />
        </motion.button>

        <motion.button
          onClick={() => bump(1)}
          whileTap={{ scale: 0.9 }}
          className="p-3 rounded-lg w-full flex items-center hover:bg-primary/70 justify-center cursor-pointer bg-primary text-primary transition-colors"
          aria-label="Increment"
        >
          <Plus className="size-4 text-primary-foreground" />
        </motion.button>
      </div>
    </div>
  );
}
