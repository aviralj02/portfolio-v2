"use client";

import { Check, Copy } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

const CODE = "ZIPPED40";

function Stub({ copied, onCopy }: { copied: boolean; onCopy: () => void }) {
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(CODE);
        onCopy();
      }}
      className="group flex w-24 shrink-0 cursor-pointer flex-col items-center justify-center gap-2 border-l-2 border-dashed border-orange-200 bg-white text-zinc-900"
    >
      <span className="text-[9px] font-semibold tracking-[0.2em] text-zinc-400 uppercase">
        Code
      </span>
      <span className="font-mono text-[11px] font-semibold tracking-wide">
        {CODE}
      </span>
      <span className="flex size-6 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition-[scale,background-color] group-hover:bg-orange-100 group-hover:text-orange-600 group-active:scale-90">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={copied ? "check" : "copy"}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {copied ? (
              <Check className="size-3" strokeWidth={3} />
            ) : (
              <Copy className="size-3" strokeWidth={2.5} />
            )}
          </motion.span>
        </AnimatePresence>
      </span>
    </button>
  );
}

export default function Ticket({
  copied,
  onCopy,
}: {
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, y: 48, rotate: -14 }}
      animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 20,
        delay: 0.2,
        opacity: { duration: 0.15 },
      }}
      className="absolute inset-0 m-auto h-32 w-68"
    >
      <motion.div
        whileHover={{ rotate: -1.5, scale: 1.03 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="size-full drop-shadow-[0_10px_18px_rgb(0_0_0/0.18)]"
      >
        <div
          style={{
            maskImage:
              "radial-gradient(circle 8px at calc(100% - 96px) 0, transparent 98%, #000), radial-gradient(circle 8px at calc(100% - 96px) 100%, transparent 98%, #000)",
            maskComposite: "intersect",
          }}
          className="flex size-full overflow-hidden rounded-xl"
        >
          <div className="flex grow flex-col justify-between bg-orange-500 bg-[linear-gradient(160deg,rgb(255_255_255/0.2),transparent_55%)] p-4 text-white">
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase opacity-75">
              You unlocked
            </p>
            <p className="flex items-baseline gap-1">
              <span className="text-5xl font-semibold tracking-tighter">
                40%
              </span>
              <span className="text-sm font-medium opacity-90">off</span>
            </p>
            <p className="text-[11px] opacity-80">on your next order</p>
          </div>

          <Stub copied={copied} onCopy={onCopy} />
        </div>
      </motion.div>
    </motion.div>
  );
}
