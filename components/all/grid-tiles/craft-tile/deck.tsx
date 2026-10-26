import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

import { FAN, spring } from "./constants";
import { ILLUSTRATIONS } from "./illustrations";

type Props = {
  playing: boolean;
};

const Deck = ({ playing }: Props) => {
  const prefersReduced = useReducedMotion();

  return (
    <div
      aria-hidden
      className="absolute inset-x-0 top-0 bottom-9 sm:bottom-11 flex items-center justify-center pointer-events-none"
    >
      <div className="relative w-28 sm:w-36 aspect-4/3">
        {ILLUSTRATIONS.map((Illustration, index) => (
          <motion.div
            key={index}
            className={cn(
              "absolute inset-0 rounded-xl bg-card card-glass p-1",
              index === 1 && "z-[1]",
            )}
            variants={{
              rest: { ...FAN[index].rest, filter: "grayscale(1)" },
              active: { ...FAN[index].active, filter: "grayscale(0)" },
            }}
            transition={
              prefersReduced
                ? { duration: 0 }
                : { ...spring, delay: index === 1 ? 0 : 0.04 }
            }
          >
            <div className="size-full grid place-items-center rounded-lg bg-secondary/60">
              <Illustration playing={playing} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Deck;
