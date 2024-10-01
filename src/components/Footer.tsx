"use client";

import React, { ReactElement, useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { footerLinks } from "@/lib/constants";
import getSocials from "@/lib/utils/get-socials";

const GithubIcon = dynamic(() => import("./icons/GithubIcon"), { ssr: false });
const LinkedInIcon = dynamic(() => import("./icons/LinkedInIcon"), {
  ssr: false,
});
const MediumIcon = dynamic(() => import("./icons/MediumIcon"), { ssr: false });
const ResumeIcon = dynamic(() => import("./icons/ResumeIcon"), { ssr: false });

type Props = {};

const Footer = (props: Props) => {
  const [socials, setSocials] = useState<Social[]>();

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
    resume: <ResumeIcon className="h-5 w-5" />,
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

            <div className="flex gap-5 items-center">
              {socials?.map((social: Social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {iconMap[social.name]}
                </a>
              ))}
            </div>
          </div>

          <div className="font-semibold text-dim">
            Developed with <span className="text-red-500">❤</span> by Aviral
          </div>
        </div>

        <div className="hidden sm:flex flex-col gap-6 flex-wrap text-dim font-semibold">
          {footerLinks.map((link: FooterLink) => (
            <Link
              key={link.label}
              href={link.to}
              className="hover:text-primary transition-all md:ml-14"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Footer;
