import Image from "next/image";

import { CHIPS } from "./constants";
import CropMarks from "./crop-marks";

type Props = {
  icon?: Asset;
  color?: string;
  stack: Array<string>;
};

/* The project's icon with its stack around it. Everything shares one grid
   cell so the marks and chips centre on the icon, and the icon, last in
   source order, stays on top. */
const Emblem = ({ icon, color, stack }: Props) => (
  <div
    aria-hidden
    className="absolute inset-x-0 top-8 bottom-24 sm:bottom-28 grid place-items-center pointer-events-none"
  >
    <div className="grid place-items-center">
      <CropMarks />

      {stack.slice(0, CHIPS.length).map((name, i) => (
        <span
          key={name}
          className="col-start-1 row-start-1 whitespace-nowrap rounded-full bg-card card-glass px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-muted-foreground"
          style={{
            translate: `${CHIPS[i].x}px ${CHIPS[i].y}px`,
            rotate: `${CHIPS[i].rotate}deg`,
          }}
        >
          {name}
        </span>
      ))}

      <div
        className="col-start-1 row-start-1 size-16 sm:size-20 rounded-[22%] overflow-hidden bg-card"
        style={{
          boxShadow: `0 0 0 1.5px ${color ?? "transparent"}, 0 10px 24px -8px rgb(0 0 0 / 0.35)`,
        }}
      >
        {icon?.url && (
          <Image
            src={icon.url}
            alt=""
            width={160}
            height={160}
            sizes="80px"
            draggable={false}
            className="size-full object-cover"
          />
        )}
      </div>
    </div>
  </div>
);

export default Emblem;
