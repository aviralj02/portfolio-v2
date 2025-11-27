"use client";

import React, { ReactElement } from "react";
import { motion } from "framer-motion";
import GithubIcon from "@/components/icons/GithubIcon";
import LinkedInIcon from "@/components/icons/LinkedInIcon";
import MediumIcon from "@/components/icons/MediumIcon";
import XIcon from "@/components/icons/XIcon";

type Props = {
  socials: Array<Social> | undefined;
};

const SocialsTile = ({ socials }: Props) => {
  const iconMap: { [key: string]: ReactElement } = {
    github: <GithubIcon className="sm:h-8 sm:w-8 h-6 w-6" />,
    linkedin: <LinkedInIcon className="sm:h-8 sm:w-8 h-6 w-6" />,
    medium: <MediumIcon className="sm:h-8 sm:w-8 h-6 w-6" />,
    x: <XIcon className="sm:h-8 sm:w-8 h-6 w-6" />,
  };

  return (
    <div className="grid grid-cols-2 gap-4 items-stretch box-border aspect-square order-3 w-full">
      {Object.keys(iconMap).map((icon: string) => {
        const socialData = socials?.find((social) => social.name === icon);

        return (
          <motion.a
            key={icon}
            target="_blank"
            rel="noreferrer"
            href={socialData?.url}
            className="rounded-2xl grid place-content-center transition-all duration-300 card-template"
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

export default SocialsTile;
