import { motion } from "motion/react";

import { spring } from "../constants";

/* Built from the theme key's surfaces. The ticks light up in turn as the
   knob sweeps past them. */
const DIAL_TICKS = [-120, -80, -40, 0, 40, 80, 120];
const DIAL_STOP = 80;

const Dial = () => (
  <div className="relative grid place-items-center size-16 sm:size-[72px]">
    {DIAL_TICKS.map((angle, i) => (
      <span
        key={angle}
        className="absolute inset-0 flex justify-center"
        style={{ rotate: `${angle}deg` }}
      >
        <motion.span
          className="key-icon w-[2px] h-1.5 rounded-full bg-current"
          variants={{
            rest: { opacity: 0.25 },
            active: { opacity: angle <= DIAL_STOP ? 1 : 0.25 },
          }}
          transition={{ duration: 0.2, delay: 0.08 + i * 0.06 }}
        />
      </span>
    ))}

    <div className="key-well rounded-full p-1 size-11 sm:size-12">
      <div className="key-face relative size-full rounded-full overflow-hidden">
        <span className="key-gloss absolute inset-0" />
        <motion.span
          className="absolute inset-0"
          variants={{ rest: { rotate: -120 }, active: { rotate: DIAL_STOP } }}
          transition={spring}
        >
          <span className="key-icon absolute top-1 left-1/2 -translate-x-1/2 w-[3px] h-2 rounded-full bg-current" />
        </motion.span>
      </div>
    </div>
  </div>
);

export default Dial;
