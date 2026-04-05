"use client";

import dynamic from "next/dynamic";

import { cn } from "@/lib/utils";

import VisitorLocation from "../VisitorLocation";

const ThemeToggle = dynamic(() => import("../ThemeToggle"), { ssr: false });

const UtilityTile = () => {
  return (
    <div
      className={cn(
        "aspect-square lg:order-9 order-8",
        "grid grid-cols-1 gap-4 lg:gap-7 auto-rows-fr w-full"
      )}
    >
      <div
        id="theme"
        className="flex justify-center items-center bg-card rounded-2xl w-full card-shadow"
      >
        <ThemeToggle />
      </div>
      <VisitorLocation />
    </div>
  );
};

export default UtilityTile;
