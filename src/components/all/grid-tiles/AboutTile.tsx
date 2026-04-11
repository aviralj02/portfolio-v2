"use client";

import dynamic from "next/dynamic";

import { cn } from "@/lib/utils";

import Globe from "../Globe";

const LiveClock = dynamic(() => import("../LiveClock"), { ssr: false });

const AboutTile = () => {
  return (
    <div
      className={cn(
        "col-span-2 row-span-2 aspect-square lg:order-2 order-1",
        "relative flex flex-col p-6 justify-between sm:p-8 bg-card rounded-2xl w-full h-auto box-border overflow-hidden group card-shadow"
      )}
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-lg sm:text-xl font-semibold">
          Hi, I&apos;m Aviral Jain
        </h1>
        <p className="text-sm sm:text-base leading-tight">
          Full Stack Engineer - I cover server to screen with design.
        </p>
        <p className="block text-sm sm:text-base leading-tight">
          Fewer handoffs, fewer gaps.
        </p>
      </div>

      <div className="hidden lg:flex flex-col items-start text-sm gap-2">
        <div className="flex items-center font-medium gap-2">
          Gurugram, <br />
          Haryana 🇮🇳
        </div>
        <LiveClock />
      </div>

      <div
        className={cn(
          "absolute left-1/2 transform -translate-x-1/2 -bottom-40 max-w-md w-full h-full",
          "lg:-bottom-28 lg:-right-20 lg:left-auto lg:translate-x-0"
        )}
      >
        <Globe />
      </div>
    </div>
  );
};

export default AboutTile;
