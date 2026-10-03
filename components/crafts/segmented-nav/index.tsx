"use client";

import { type KeyboardEvent, useEffect, useRef, useState } from "react";

import { AnimatePresence, motion, MotionConfig } from "motion/react";

const ITEMS = ["Home", "Work", "Craft", "Notes", "Stack", "About", "Contact"];

const SPRING = { type: "spring", bounce: 0.25, duration: 0.55 } as const;

// Ticks shrink and fade the further they sit from the open pill.
const FALLOFF = [
  { height: 22, opacity: 0.55 },
  { height: 16, opacity: 0.3 },
  { height: 12, opacity: 0.15 },
];

const KEY_STEPS: Record<string, (i: number) => number> = {
  ArrowRight: (i) => i + 1,
  ArrowLeft: (i) => i - 1,
  Home: () => 0,
  End: () => ITEMS.length - 1,
};

export default function SegmentedNav() {
  const [active, setActive] = useState(2);
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([]);
  // Hover and keyboard focus both preview a tab by opening it; with
  // neither, the pill rests on the active one.
  const open = hovered ?? focused ?? active;

  // Land focus on the active tab on open and reset, so the arrows work
  // straight away.
  useEffect(() => {
    buttonsRef.current[active]?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    const step = KEY_STEPS[e.key];
    if (!step) return;
    e.preventDefault();
    const next = Math.min(ITEMS.length - 1, Math.max(0, step(focused ?? active)));
    // Arrows only move the preview; Enter (a native button click) commits it.
    setHovered(null);
    buttonsRef.current[next]?.focus();
  };

  return (
    <MotionConfig reducedMotion="user" transition={SPRING}>
      <div className="flex w-full grow flex-col items-center justify-center gap-6">
        <nav
          onKeyDown={handleKeyDown}
          onMouseLeave={() => setHovered(null)}
          className="flex h-12 items-center rounded-full bg-muted px-2 shadow-[inset_0_1px_2px_rgb(0_0_0/0.06)]"
        >
          {ITEMS.map((label, i) => {
            const isOpen = i === open;
            const isActive = i === active;
            const distance = Math.abs(i - open);
            const tick = FALLOFF[Math.min(Math.max(distance, 1), FALLOFF.length) - 1];

            return (
              <motion.button
                key={label}
                ref={(el) => {
                  buttonsRef.current[i] = el;
                }}
                type="button"
                // Roving tabindex: Tab enters on the active tab, arrows do the rest.
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActive(i)}
                onMouseEnter={() => setHovered(i)}
                onFocus={() => setFocused(i)}
                onBlur={() => setFocused(null)}
                whileTap={{ scale: 0.94 }}
                aria-label={label}
                aria-current={isActive ? "page" : undefined}
                className="relative grid h-full cursor-pointer place-items-center px-2 outline-none"
              >
                {/* The tick itself stretches into the pill, so there's
                  never a second shape sliding over the track. */}
                <motion.span
                  initial={false}
                  animate={
                    isOpen
                      ? { width: "auto", height: 32, opacity: 1, borderRadius: 10 }
                      : { width: 4, height: tick.height, opacity: tick.opacity, borderRadius: 2 }
                  }
                  className="grid place-items-center overflow-hidden bg-foreground text-background"
                >
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                        transition={{ duration: 0.2 }}
                        className="col-start-1 row-start-1 px-3.5 text-xs font-medium tracking-wide whitespace-nowrap uppercase"
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.span>

                {/* While another tab is previewed, a dot keeps the active one findable. */}
                <AnimatePresence>
                  {isActive && !isOpen && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ duration: 0.15 }}
                      className="pointer-events-none absolute bottom-0.5 size-1 rounded-full bg-foreground"
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </nav>

        <p className="text-[11px] font-medium text-muted-foreground">
          Hover or use the arrows to peek, click or Enter to pick
        </p>
      </div>
    </MotionConfig>
  );
}
