"use client";

import React, { ReactElement } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const GithubIcon = dynamic(() => import("../icons/GithubIcon"), { ssr: false });
const LinkedInIcon = dynamic(() => import("../icons/LinkedInIcon"), {
  ssr: false,
});
const MediumIcon = dynamic(() => import("../icons/MediumIcon"), { ssr: false });

type Props = {};

type Social = {
  label: string;
  icon: ReactElement;
  to: string;
};

const SocialsTile = (props: Props) => {
  const socials: Social[] = [
    {
      label: "github",
      icon: <GithubIcon className="sm:h-8 sm:w-8 h-6 w-6" />,
      to: "/",
    },
    {
      label: "linkedin",
      icon: <LinkedInIcon className="sm:h-8 sm:w-8 h-6 w-6" />,
      to: "/",
    },
    {
      label: "medium",
      icon: <MediumIcon className="sm:h-8 sm:w-8 h-6 w-6" />,
      to: "/",
    },
    {
      label: "something",
      icon: <GithubIcon className="sm:h-8 sm:w-8 h-6 w-6" />,
      to: "/",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 items-stretch box-border aspect-square order-3">
      {socials.map((social: Social) => (
        <motion.a
          key={social.label}
          target="_blank"
          rel="noreferrer"
          href={social.to}
          className="bg-card rounded-2xl grid place-content-center hover:bg-accent transition-all duration-300"
          whileHover="hover"
        >
          <motion.div
            variants={{
              hover: { scale: 1.08 },
            }}
            className="opacity-80"
          >
            {social.icon}
          </motion.div>
        </motion.a>
      ))}
    </div>
  );
};

export default SocialsTile;
