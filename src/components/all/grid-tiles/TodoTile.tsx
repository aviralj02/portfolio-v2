"use client";

import { cn } from "@/lib/utils";
import { CornerDownLeft } from "lucide-react";
import React, { KeyboardEvent } from "react";

const TodoTile = () => {
  return (
    <div
      className={cn(
        "col-span-2 order-5",
        "flex flex-col p-6 w-full bg-card rounded-2xl"
      )}
    >
      <div className="relative flex items-center mb-4 w-full">
        <input
          type="text"
          // value={}
          // onChange={}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
            }
          }}
          className="py-2 px-5 rounded-full w-full bg-secondary sm:text-base text-sm text-muted-foreground outline-none placeholder-dim"
          placeholder="What's on your mind today?"
        />
        <button className="absolute right-2 p-2 text-muted-foreground rounded-full">
          <CornerDownLeft className="sm:w-5 sm:h-5 w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TodoTile;
