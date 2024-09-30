import React from "react";
import { cn } from "@/lib/utils";
import Globe from "../Globe";
import dynamic from "next/dynamic";

const LiveClock = dynamic(() => import("../LiveClock"), { ssr: false });

type Props = {};

const AboutTile: React.FC<Props> = () => {
  return (
    <div
      className={cn(
        "col-span-2 row-span-2 aspect-square lg:order-2 order-1",
        "relative flex flex-col p-6 justify-between sm:p-8 bg-card rounded-2xl w-full h-auto box-border overflow-hidden group"
      )}
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-lg sm:text-xl font-semibold">
          Hi, I&apos;m Aviral Jain
        </h1>
        <p className="text-sm sm:text-base leading-tight">
          I&apos;m a full-stack engineer from India who enjoys building user
          friendly applications with solid design.
        </p>
        <p className="hidden lg:block text-sm sm:text-base leading-tight">
          Turning ideas into easy-to-use software solutions.
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
