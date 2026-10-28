"use client";

import { Link } from "next-view-transitions";

import { motion, MotionConfig, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

import { SPARKS } from "./craft-tile/constants";
import Deck from "./craft-tile/deck";
import ShootingStars from "./craft-tile/shooting-stars";
import Halftone from "./shared/halftone";
import Sparks from "./shared/sparks";
import TileLabel from "./shared/tile-label";
import { useTileActive } from "./shared/use-tile-active";

const CraftsTile = () => {
  const { ref, active, hoverProps } = useTileActive<HTMLDivElement>();
  const prefersReduced = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      {/* Every layer below picks up "rest" / "active" from here. */}
      <motion.div
        ref={ref}
        className={cn(
          "col-span-2 order-5",
          "group relative w-full min-h-44 sm:min-h-52 rounded-2xl overflow-hidden card-template",
        )}
        {...hoverProps}
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
        <Sparks positions={SPARKS} />
        <Deck playing={active && !prefersReduced} />

        <TileLabel title="Craft" />
      </motion.div>
    </MotionConfig>
  );
};

export default CraftsTile;
