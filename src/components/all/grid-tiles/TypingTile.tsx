"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { typingProps } from "@/lib/constants";
import TypingArea from "../TypingArea";
import { motion } from "framer-motion";
import { Fira_Code } from "next/font/google";

const fira = Fira_Code({ subsets: ["latin"] });

const TypingTile = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const effectKeys: string[] = Object.keys(typingProps);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % effectKeys.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? effectKeys.length - 1 : prevIndex - 1
    );
  };

  return (
    <div
      className={cn(
        "col-span-2 order-5",
        "flex flex-col p-4 w-full items-center sm:justify-between gap-4 sm:gap-0 bg-card rounded-2xl card-shadow"
      )}
    >
      <TypingArea
        currentIndex={currentIndex}
        effectKeys={effectKeys}
        textAreaRef={textAreaRef}
      />

      <div className="flex items-center max-w-60 w-full justify-between">
        <motion.button
          onClick={() => {
            handlePrev();
            textAreaRef.current?.focus();
          }}
          className="p-1 bg-background rounded-full"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="h-4 w-4 cursor-pointer" />
        </motion.button>

        <div
          className={cn(
            fira.className,
            "font-medium text-xs text-center select-none text-secondary-text bg-background p-1 max-w-32 w-full rounded-full"
          )}
        >
          {effectKeys[currentIndex].replace(/-/g, " ")}
        </div>

        <motion.button
          onClick={() => {
            handleNext();
            textAreaRef.current?.focus();
          }}
          className="p-1 bg-background rounded-full"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowRight className="h-4 w-4 cursor-pointer" />
        </motion.button>
      </div>
    </div>
  );
};

export default TypingTile;
