"use client";

import { ReactElement } from "react";
import { motion } from "motion/react";
import dynamic from "next/dynamic";

const GithubIcon = dynamic(() => import("@/components/icons/GithubIcon"), {
  ssr: false,
});
const LinkedInIcon = dynamic(() => import("@/components/icons/LinkedInIcon"), {
  ssr: false,
});
const MediumIcon = dynamic(() => import("@/components/icons/MediumIcon"), {
  ssr: false,
});
const XIcon = dynamic(() => import("@/components/icons/XIcon"), {
  ssr: false,
});

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
