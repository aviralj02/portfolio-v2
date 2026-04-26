"use client";

import { ReactElement, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useTheme } from "next-themes";

import { ArrowUpDown } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { footerLinks } from "@/lib/constants";
import { toggleThemeWithTransition } from "@/lib/utils";
import getSocials from "@/lib/utils/get-socials";

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
const PageoIcon = dynamic(() => import("@/components/icons/PageoIcon"), {
  ssr: false,
});

const Footer = () => {
  const [socials, setSocials] = useState<Social[]>();
  const { theme, setTheme } = useTheme();
  const prefersReduced = useReducedMotion();

  const fetchSocials = async () => {
    const socialsData = await getSocials();
    setSocials(socialsData);
  };

  useEffect(() => {
    fetchSocials();
  }, []);

  const iconMap: { [key: string]: ReactElement } = {
    github: <GithubIcon className="size-4" />,
    linkedin: <LinkedInIcon className="size-4" />,
    medium: <MediumIcon className="size-4" />,
    x: <XIcon className="size-4" />,
    pageo: <PageoIcon className="size-4" />,
  };

  const isLastRow = (index: number) => index >= footerLinks.length - 2;

  const linkInner = (label: string, index: number, isTheme?: boolean) => {
    const idx = String(index + 1).padStart(2, "0");
    return (
      <>
        <div className="relative w-5 h-[1em] overflow-hidden shrink-0">
          <span className="absolute inset-0 flex items-center font-mono text-[10px] tabular-nums text-dim/80 transition-transform duration-300 ease-out group-hover:-translate-y-full">
            {idx}
          </span>
          <span className="absolute inset-0 flex items-center font-mono text-[11px] text-primary translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0">
            →
          </span>
        </div>
        <span className="transition-colors duration-300 group-hover:text-primary">
          {label}
        </span>
        {isTheme && (
          <ArrowUpDown
            strokeWidth={1.75}
            className="w-3.5 h-auto ml-0.5 text-dim/80 transition-colors duration-300 group-hover:text-primary"
          />
        )}
      </>
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-2.5 md:px-20 w-full">
      <hr className="w-full border-0 h-px bg-dim/40" />

      <div className="flex justify-between mt-8 px-6 gap-8">
        <div className="flex flex-col gap-6">
          <div className="flex gap-8 items-center">
            {Object.keys(iconMap).map((icon: string) => {
              const socialData = socials?.find(
                (social) => social.name === icon
              );

              return (
                <a
                  key={icon}
                  href={socialData?.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {iconMap[icon]}
                </a>
              );
            })}
          </div>

          <div className="font-medium text-dim text-sm">
            Developed with{" "}
            <motion.span
              aria-label="love"
              className="text-red-400/85 inline-block origin-center"
              animate={
                prefersReduced ? undefined : { scale: [1, 1.12, 1, 1.07, 1] }
              }
              transition={{
                duration: 1.2,
                repeat: Infinity,
                repeatDelay: 2.6,
                ease: "easeInOut",
              }}
            >
              ❤
            </motion.span>{" "}
            by Aviral
          </div>
        </div>

        <div className="hidden sm:grid grid-cols-2 gap-x-8 gap-y-3 text-dim font-medium self-start">
          {footerLinks.map((link: FooterLink, index: number) => (
            <motion.div
              key={link.label}
              className={!isLastRow(index) ? "border-b border-dim/20" : ""}
              initial={prefersReduced ? false : { opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: index * 0.06,
                duration: 0.4,
                ease: "easeOut",
              }}
            >
              {link.label === "Theme" ? (
                <button
                  onClick={toggleThemeWithTransition(() =>
                    setTheme(theme === "light" ? "dark" : "light")
                  )}
                  className="group flex items-center gap-2 py-2 text-sm w-full"
                >
                  {linkInner(link.label, index, true)}
                </button>
              ) : (
                <Link
                  href={link.to}
                  className="group flex items-center gap-2 py-2 text-sm w-full"
                >
                  {linkInner(link.label, index)}
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Footer;
