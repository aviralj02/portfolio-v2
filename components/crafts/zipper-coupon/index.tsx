"use client";

import { useEffect, useState } from "react";

import { animate, AnimatePresence, motion, useMotionValue } from "motion/react";

import { cn } from "@/lib/utils";

import Ticket from "./ticket";
import { Half, HEIGHT, Lining, Pull, WIDTH } from "./zipper";

export default function ZipperCoupon() {
  const [opened, setOpened] = useState(false);
  const [copied, setCopied] = useState(false);
  const pull = useMotionValue(0);

  const handleRelease = () => {
    if (pull.get() < WIDTH * 0.85) return;
    animate(pull, WIDTH, { duration: 0.2 }).then(() => setOpened(true));
  };

  useEffect(() => {
    const hint = animate(pull, [0, 20, 0], {
      delay: 0.6,
      duration: 1.1,
      ease: "easeInOut",
    });
    return () => hint.stop();
  }, [pull]);

  return (
    <div className="flex w-full grow flex-col items-center justify-center gap-8">
      <div className="relative" style={{ width: WIDTH, height: HEIGHT }}>
        <Lining opened={opened} />

        <Half pull={pull} side={-1} opened={opened} />
        <Half pull={pull} side={1} opened={opened} />

        <Pull pull={pull} opened={opened} onRelease={handleRelease} />

        <AnimatePresence>
          {opened && <Ticket copied={copied} onCopy={() => setCopied(true)} />}
        </AnimatePresence>
      </div>

      <p aria-live="polite" className="text-[11px] font-medium">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={copied ? "copied" : opened ? "opened" : "idle"}
            initial={{ opacity: 0, y: 4, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -4, filter: "blur(4px)" }}
            transition={{ duration: 0.2 }}
            className={cn(
              "inline-block",
              opened ? "text-primary" : "text-muted-foreground",
            )}
          >
            {copied
              ? "Copied. See you at checkout"
              : opened
                ? "Tap the stub to copy"
                : "Drag the pull to unzip"}
          </motion.span>
        </AnimatePresence>
      </p>
    </div>
  );
}
