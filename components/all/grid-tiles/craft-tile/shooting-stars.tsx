import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

import { SHOOTING_STARS } from "./constants";

const ShootingStars = () => {
  const prefersReduced = useReducedMotion();

  return SHOOTING_STARS.map((star) => (
    <span
      key={star.position}
      aria-hidden
      className={cn("absolute pointer-events-none", star.position)}
      style={{ rotate: "150deg", transformOrigin: "left center" }}
    >
      {/* Bright at the leading edge, trailing off behind it. */}
      <motion.span
        className="block h-px w-12 sm:w-16 rounded-full bg-linear-to-l from-foreground/60 to-transparent"
        variants={{
          rest: prefersReduced
            ? { opacity: 0 }
            : {
                x: [0, 520],
                opacity: [0, 1, 1, 0],
                transition: {
                  duration: star.duration,
                  delay: star.delay,
                  repeat: Infinity,
                  repeatDelay: star.gap,
                  ease: "easeIn",
                  times: [0, 0.15, 0.7, 1],
                },
              },
          active: { opacity: 0, transition: { duration: 0.2 } },
        }}
      />
    </span>
  ));
};

export default ShootingStars;
