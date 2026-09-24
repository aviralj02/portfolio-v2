"use client";

import { AnimatePresence, motion, type Variants } from "motion/react";

const word: Variants = {
  visible: { transition: { staggerChildren: 0.025 } },
  exit: { transition: { staggerChildren: 0.02 } },
};

const letter: Variants = {
  hidden: { opacity: 0, y: 8, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -8, filter: "blur(4px)" },
};

export default function MorphText({ text, id }: { text: string; id: number }) {
  return (
    <span className="grid">
      <AnimatePresence initial={false}>
        <motion.span
          key={id}
          variants={word}
          initial="hidden"
          animate="visible"
          exit="exit"
          aria-hidden
          className="col-start-1 row-start-1 flex whitespace-pre"
        >
          {text.split("").map((char, i) => (
            <motion.span
              key={i}
              variants={letter}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
