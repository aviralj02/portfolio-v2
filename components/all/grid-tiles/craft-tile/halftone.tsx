import { motion, useReducedMotion } from "motion/react";

/* Halftone field, densest behind the deck and dissolving outwards. */
const Halftone = () => {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      aria-hidden
      className="absolute inset-0 pointer-events-none text-foreground"
      style={{
        backgroundImage: "radial-gradient(currentColor 0.8px, transparent 1.2px)",
        backgroundSize: "7px 7px",
        maskImage:
          "radial-gradient(ellipse 45% 55% at 50% 45%, black, transparent)",
      }}
      variants={{
        rest: { opacity: 0.12, scale: 0.9 },
        active: { opacity: 0.2, scale: 1 },
      }}
      transition={
        prefersReduced
          ? { duration: 0 }
          : { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
      }
    />
  );
};

export default Halftone;
