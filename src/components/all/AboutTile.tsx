import React from "react";
import { cn } from "@/lib/utils";
import Globe from "./Globe";

type Props = {};

const AboutTile: React.FC<Props> = () => {
  return (
    <div
      className={cn(
        "col-span-2 row-span-2 aspect-square lg:order-2 order-1",
        "relative flex flex-col p-6 sm:p-8 bg-card rounded-2xl w-full h-auto box-border overflow-hidden"
      )}
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-lg sm:text-xl font-semibold">
          Hi, I&apos;m Aviral Jain
        </h1>
        <p className="text-sm sm:text-base leading-tight">
          I&apos;m a full-stack engineer from India who enjoys building
          applications that offer a great user experience and robust software
          design.
        </p>
      </div>

      <div
        className={cn(
          "absolute left-1/2 transform -translate-x-1/2 -bottom-40 max-w-md w-full h-full",
          "md:-bottom-28 md:-right-20 md:left-auto md:translate-x-0"
        )}
      >
        <Globe />
      </div>
    </div>
  );
};

export default AboutTile;
