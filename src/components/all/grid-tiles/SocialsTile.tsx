"use client";

import React, { ReactElement, useEffect, useState } from "react";
import { motion } from "framer-motion";
import getSocials from "@/lib/utils/get-socials";
import GithubIcon from "@/components/icons/GithubIcon";
import LinkedInIcon from "@/components/icons/LinkedInIcon";
import MediumIcon from "@/components/icons/MediumIcon";
import ResumeIcon from "@/components/icons/ResumeIcon";

type Props = {};

const SocialsTile = (props: Props) => {
  const [socials, setSocials] = useState<Social[]>();

  const fetchSocials = async () => {
    const socialsData = await getSocials();
    setSocials(socialsData);
  };

  useEffect(() => {
    fetchSocials();
  }, []);

  const iconMap: { [key: string]: ReactElement } = {
    github: <GithubIcon className="sm:h-8 sm:w-8 h-6 w-6" />,
    linkedin: <LinkedInIcon className="sm:h-8 sm:w-8 h-6 w-6" />,
    medium: <MediumIcon className="sm:h-8 sm:w-8 h-6 w-6" />,
    resume: <ResumeIcon className="sm:h-8 sm:w-8 h-6 w-6" />,
  };

  return (
    <div className="grid grid-cols-2 gap-4 items-stretch box-border aspect-square order-3 w-full">
      {socials?.map((social: Social) => (
        <motion.a
          key={social.name}
          target="_blank"
          rel="noreferrer"
          href={social.url}
          className="bg-card rounded-2xl grid place-content-center hover:bg-accent transition-all duration-300"
          whileHover="hover"
        >
          <motion.div
            variants={{
              hover: { scale: 1.08 },
            }}
            className="opacity-80"
          >
            {iconMap[social.name]}
          </motion.div>
        </motion.a>
      ))}
    </div>
  );
};

export default SocialsTile;
