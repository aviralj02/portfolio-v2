"use client";

import { RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";

type Tab = "preview" | "source";

type Props = {
  tab: Tab;
  onTabChange: (tab: Tab) => void;
  onReset: () => void;
  showReset: boolean;
};

const TABS: Array<{ key: Tab; label: string }> = [
  { key: "preview", label: "Preview" },
  { key: "source", label: "Source" },
];

const Toolbar = ({ tab, onTabChange, onReset, showReset }: Props) => {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="rounded-full p-px nav-glass-ring">
        <motion.div
          layout
          layoutRoot
          role="tablist"
          aria-label="Craft view"
          className="inline-flex items-center gap-0.5 rounded-full p-0.5 nav-glass-body"
        >
          {TABS.map((t) => (
            <motion.button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => onTabChange(t.key)}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "relative px-4 py-1.5 cursor-pointer text-xs font-medium rounded-full transition-colors duration-200",
                tab === t.key
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              {tab === t.key && (
                <motion.div
                  layoutId="craft-toolbar-active-pill"
                  className="absolute inset-0 rounded-full nav-glass-pill"
                  transition={{
                    layout: {
                      type: "spring",
                      stiffness: 420,
                      damping: 34,
                    },
                  }}
                />
              )}
              <span className="relative z-10">{t.label}</span>
            </motion.button>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {showReset && (
          <motion.button
            onClick={onReset}
            aria-label="Reset craft"
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, x: 6, filter: "blur(4px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: 6, filter: "blur(4px)" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="rounded-full p-px nav-glass-ring"
          >
            <span className="flex items-center cursor-pointer gap-1.5 px-3 py-1.5 rounded-full nav-glass-body text-xs font-medium text-muted-foreground hover:text-primary transition-colors duration-200">
              <RotateCcw className="size-3" />
              Reset
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Toolbar;
