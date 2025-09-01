"use client";

import React, { ReactElement, useEffect, useState } from "react";
import Link from "next/link";
import { footerLinks } from "@/lib/constants";
import getSocials from "@/lib/utils/get-socials";
import LinkedInIcon from "./icons/LinkedInIcon";
import MediumIcon from "./icons/MediumIcon";
import GithubIcon from "./icons/GithubIcon";
import { ArrowUpDown } from "lucide-react";
import { useTheme } from "next-themes";
import XIcon from "./icons/XIcon";
import PageoIcon from "./icons/PageoIcon";

type Props = {};

const Footer = (props: Props) => {
  const [socials, setSocials] = useState<Social[]>();
  const { theme, setTheme } = useTheme();

  const fetchSocials = async () => {
    const socialsData = await getSocials();
    setSocials(socialsData);
  };

  useEffect(() => {
    fetchSocials();
  }, []);

  const iconMap: { [key: string]: ReactElement } = {
    github: <GithubIcon className="h-5 w-5" />,
    linkedin: <LinkedInIcon className="h-5 w-5" />,
    medium: <MediumIcon className="h-5 w-5" />,
    x: <XIcon className="h-5 w-5" />,
    pageo: <PageoIcon className="h-5 w-5" />,
  };

  return (
    <div className="max-w-screen-xl mx-auto py-8 px-2.5 md:px-20">
      <hr className="w-full border-0 h-[1px] bg-dim" />

      <div className="flex justify-between mt-12 px-6 h-44">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col text-left font-semibold text-lg text-secondary-text leading-6">
              <span>Have an idea?</span>
              <span>Let&apos;s bring it to life together!</span>
            </div>

            <div className="flex gap-8 items-center">
              {Object.keys(iconMap).map((icon: string) => {
                const socialData = socials?.find(
                  (social) => social.name === icon
                );

                return (
                  <a
                    key={socialData?.name}
                    href={socialData?.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {iconMap[icon]}
                  </a>
                );
              })}
            </div>
          </div>

          <div className="font-semibold text-dim">
            Developed with <span className="text-red-500">❤</span> by Aviral
          </div>
        </div>

        <div className="hidden sm:flex flex-col gap-6 flex-wrap text-dim font-semibold">
          {footerLinks.map((link: FooterLink) => {
            if (link.label === "Theme") {
              return (
                <button
                  key={link.label}
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                  className="flex gap-1 items-center hover:text-primary transition-all md:ml-14"
                >
                  Theme <ArrowUpDown className="w-4 h-auto" />
                </button>
              );
            } else {
              return (
                <Link
                  key={link.label}
                  href={link.to}
                  className="hover:text-primary transition-all md:ml-14"
                >
                  {link.label}
                </Link>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default Footer;
