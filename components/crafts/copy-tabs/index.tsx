"use client";

import { useEffect, useRef, useState } from "react";

import { AnimatePresence, motion, MotionConfig } from "motion/react";

const EMAIL = "hello@example.com";

const TABS = ["E-mail", "Click to copy", "Copied!"];

const SPRING = { type: "spring", bounce: 0.2, duration: 0.5 } as const;

export default function CopyTabs() {
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number>(undefined);
  // The button is always on exactly one tab: what it is, what a click
  // does, or what just happened.
  const open = copied ? 2 : hovered ? 1 : 0;

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  const handleCopy = () => {
    void navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true);
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setCopied(false), 1400);
    });
  };

  return (
    <MotionConfig reducedMotion="user" transition={SPRING}>
      <div className="flex w-full grow flex-col items-center justify-center">
        {/* The padding is a hover buffer: the button reacts a little before
          the cursor reaches it, and doesn't snap shut on a near miss. */}
        <div
          onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          className="p-4"
        >
          <motion.button
            type="button"
            onClick={handleCopy}
            onFocus={(e) => setHovered(e.target.matches(":focus-visible"))}
            onBlur={() => setHovered(false)}
            whileTap={{ scale: 0.96 }}
            aria-label={`Copy e-mail address ${EMAIL}`}
            className="flex h-9 cursor-pointer items-center gap-1 rounded-[10px] outline-none select-none focus-visible:ring-2 focus-visible:ring-foreground/20 focus-visible:ring-offset-4 focus-visible:ring-offset-card"
          >
            {TABS.map((label, i) => (
              <motion.span
                key={label}
                initial={false}
                animate={
                  i === open
                    ? { width: "auto", borderRadius: 10, opacity: 1 }
                    : { width: 6, borderRadius: 3, opacity: 0.25 }
                }
                className="grid h-full place-items-center overflow-hidden bg-foreground text-background"
              >
                <AnimatePresence initial={false}>
                  {i === open && (
                    <motion.span
                      initial={{ opacity: 0, filter: "blur(4px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, filter: "blur(4px)" }}
                      transition={{ duration: 0.2 }}
                      className="col-start-1 row-start-1 px-3.5 font-mono text-xs font-medium tracking-[0.08em] whitespace-nowrap uppercase"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.span>
            ))}
            <span role="status" className="sr-only">
              {copied ? "Copied" : ""}
            </span>
          </motion.button>
        </div>

        <p className="text-[11px] font-medium text-muted-foreground">
          Hover, then click
        </p>
      </div>
    </MotionConfig>
  );
}
