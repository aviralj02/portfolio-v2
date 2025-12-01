"use client";

import { cn, toggleThemeWithTransition } from "@/lib/utils";
import { motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

type Props = {};

const ThemeToggle = (props: Props) => {
  const { setTheme, theme } = useTheme();

  return (
    <div
      onClick={toggleThemeWithTransition(() =>
        setTheme(theme === "light" ? "dark" : "light")
      )}
      className={cn(
        "flex items-center sm:h-12 sm:w-24 h-10 w-20 rounded-full bg-secondary p-[5px] shadow-inner hover:cursor-pointer",
        theme === "dark" && "justify-end"
      )}
    >
      <motion.div
        className="flex sm:h-10 sm:w-10 h-8 w-8 items-center justify-center rounded-full bg-primary-foreground"
        layout
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      >
        <motion.div>
          {theme === "dark" ? (
            <Moon className="sm:h-6 sm:w-6 h-4 w-4 text-primary" />
          ) : (
            <Sun className="sm:h-6 sm:w-6 h-4 w-4 text-primary" />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ThemeToggle;
