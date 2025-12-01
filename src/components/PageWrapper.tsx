"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import React, { FC, ReactElement, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

const PageWrapper: FC<Props> = ({
  children,
  className,
}: Props): ReactElement => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className={cn("mx-auto w-full max-w-screen-xl px-6 md:px-20", className)}
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;
