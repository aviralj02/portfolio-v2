"use client";

import { useRef, useState } from "react";
import { Link } from "next-view-transitions";

import { ArrowUpRight } from "lucide-react";
import { motion, MotionConfig, useInView, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

import Deck from "./craft-tile/deck";
import Halftone from "./craft-tile/halftone";
import ShootingStars from "./craft-tile/shooting-stars";
import Sparks from "./craft-tile/sparks";
import { useIsTouch } from "./craft-tile/use-is-touch";

const CraftsTile = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const prefersReduced = useReducedMotion();

  const isInView = useInView(ref, { amount: "all" });
  const isTouch = useIsTouch();

  /* Touch has no hover, so the fan opens once the tile is fully on screen.
     Every layer below picks up "rest" / "active" from here. */
  const active = isTouch ? isInView : hovered;

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        ref={ref}
        className={cn(
          "col-span-2 order-5",
          "group relative w-full min-h-44 sm:min-h-52 rounded-2xl overflow-hidden card-template",
        )}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        animate={active ? "active" : "rest"}
        initial="rest"
      >
        <Link
          href="/craft"
          aria-label="Craft: UI experiments, animations and interactive demos"
          className="absolute inset-0 z-10 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-secondary-text/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        />

        <Halftone />
        <ShootingStars />
        <Sparks />
        <Deck playing={active && !prefersReduced} />

        <div className="absolute left-3 bottom-3 sm:left-5 sm:bottom-4 flex items-center gap-1 pointer-events-none">
          <h2 className="text-sm sm:text-base font-semibold tracking-tight">
            Craft
          </h2>
          <ArrowUpRight
            aria-hidden
            className="w-4 h-4 text-muted-foreground transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>
      </motion.div>
    </MotionConfig>
  );
};

export default CraftsTile;
