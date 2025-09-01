"use client";

import PageoIcon from "@/components/icons/PageoIcon";
import ResumeIcon from "@/components/icons/ResumeIcon";
import { motion } from "framer-motion";
import { ReactElement } from "react";

type Props = {
  socials: Array<Social> | undefined;
};

const ExtraLinks = ({ socials }: Props) => {
  const iconMap: { [key: string]: ReactElement } = {
    pageo: <PageoIcon className="sm:h-8 sm:w-8 h-6 w-6" />,
    resume: <ResumeIcon className="sm:h-8 sm:w-8 h-6 w-6" />,
  };

  return (
    <div className="grid grid-cols-2 aspect-1/2 h-1/5 gap-4 lg:gap-7">
      {Object.keys(iconMap).map((icon: string) => {
        const socialData = socials?.find((social) => social.name === icon);

        return (
          <motion.a
            key={socialData?.name}
            target="_blank"
            rel="noreferrer"
            href={socialData?.url}
            className="bg-card rounded-2xl grid place-content-center hover:bg-accent transition-all duration-300"
            whileHover="hover"
          >
            <motion.div
              variants={{
                hover: { scale: 1.08 },
              }}
              className="opacity-80"
            >
              {iconMap[icon]}
            </motion.div>
          </motion.a>
        );
      })}
    </div>
  );
};

export default ExtraLinks;
