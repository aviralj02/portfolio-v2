"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { ChangeEvent, RefObject, useEffect, useState } from "react";
import { Fira_Code } from "next/font/google";
import { typingProps } from "@/lib/constants";
import { cn } from "@/lib/utils";

const fira = Fira_Code({ subsets: ["latin"] });

type Props = {
  textAreaRef: RefObject<HTMLTextAreaElement>;
  effectKeys: string[];
  currentIndex: number;
};

const TypingArea = ({ textAreaRef, effectKeys, currentIndex }: Props) => {
  const [text, setText] = useState<string>("");

  useEffect(() => {
    if (text === "") {
      setText("start typing... \npick one style to bring your words to life");
    }
  }, [text]);

  return (
    <>
      <textarea
        className="w-0 h-0 opacity-0"
        ref={textAreaRef}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          setText(e.target.value)
        }
      />
      <div
        onClick={() => textAreaRef.current?.focus()}
        className={cn(
          fira.className,
          "relative w-full h-44 text-xs sm:text-sm bg-secondary whitespace-pre-wrap rounded-xl p-5 overflow-y-scroll scrollbar"
        )}
      >
        <AnimatePresence>
          {text.split("").map((letter: string, index: number) => (
            <motion.span
              initial={typingProps[effectKeys[currentIndex]]?.initial}
              animate={typingProps[effectKeys[currentIndex]]?.animate}
              exit={typingProps[effectKeys[currentIndex]]?.exit}
              transition={typingProps[effectKeys[currentIndex]]?.transition}
              key={index}
              className={letter !== "\n" ? "inline-block" : "inline"}
            >
              {letter}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
};

export default TypingArea;
