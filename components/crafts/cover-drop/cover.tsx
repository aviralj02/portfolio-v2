"use client";

import { type Ref, useState } from "react";

import { ImagePlus, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

import { LiquidPhoto } from "./liquid-photo";
import { DRAIN, EASE_OUT, liquidMask, type Photo, src } from "./shared";

type Props = {
  ref: Ref<HTMLDivElement>;
  photo: Photo | undefined;
  over: boolean;
  onRemove: () => void;
};

export function Cover({ ref, photo, over, onRemove }: Props) {
  return (
    <div ref={ref} className="relative h-48 w-72">
      <motion.div
        animate={{ scale: over ? 1.03 : 1 }}
        transition={{ duration: 0.25, ease: EASE_OUT }}
        className={cn(
          "absolute inset-0 grid place-items-center rounded-2xl border border-dashed transition-colors duration-200",
          over
            ? "border-foreground/40 bg-foreground/5"
            : "border-foreground/15 bg-muted/60",
        )}
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <ImagePlus className="size-5" strokeWidth={1.75} />
          <span className="text-xs font-medium">
            {over ? "Drop to set cover" : "Drag a photo here"}
          </span>
        </div>
      </motion.div>

      <AnimatePresence>
        {photo && (
          <motion.div
            key={photo.id}
            style={liquidMask("135%")}
            exit={{ "--r": "0%", transition: DRAIN }}
            className="absolute inset-0 overflow-hidden rounded-2xl"
          >
            <CoverPhoto photo={photo} />

            <motion.button
              type="button"
              aria-label="Remove cover"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, ease: EASE_OUT, delay: 0.45 }}
              exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.1 } }}
              whileTap={{ scale: 0.9 }}
              onClick={onRemove}
              className="absolute top-2.5 right-2.5 grid size-7 cursor-pointer place-items-center rounded-full bg-black/45 text-white backdrop-blur-md transition-colors duration-150 outline-none hover:bg-black/60 focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <X className="size-3.5" strokeWidth={2.5} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CoverPhoto({ photo }: { photo: Photo }) {
  const [settled, setSettled] = useState(false);
  const reduceMotion = useReducedMotion();

  if (!settled && !reduceMotion) {
    return (
      <LiquidPhoto src={src(photo.id)} onSettled={() => setSettled(true)} />
    );
  }

  return (
    <motion.img
      src={src(photo.id)}
      alt={photo.alt}
      draggable={false}
      initial={reduceMotion ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      className="absolute inset-0 size-full object-cover"
    />
  );
}
