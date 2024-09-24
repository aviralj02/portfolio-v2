"use client";

import React, { ReactElement } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const GithubIcon = dynamic(() => import("./icons/GithubIcon"), { ssr: false });
const LinkedInIcon = dynamic(() => import("./icons/LinkedInIcon"), {
  ssr: false,
});
const MediumIcon = dynamic(() => import("./icons/MediumIcon"), { ssr: false });

type Props = {};

type Social = {
  label: string;
  icon: ReactElement;
  to: string;
};

type FooterLink = Omit<Social, "icon">;

const Footer = (props: Props) => {
  const socials: Social[] = [
    {
      label: "github",
      icon: <GithubIcon className="h-5 w-5" />,
      to: "/",
    },
    {
      label: "linkedin",
      icon: <LinkedInIcon className="h-5 w-5" />,
      to: "/",
    },
    {
      label: "medium",
      icon: <MediumIcon className="h-5 w-5" />,
      to: "/",
    },
    {
      label: "something",
      icon: <GithubIcon className="h-5 w-5" />,
      to: "/",
    },
  ];

  const footerLinks: FooterLink[] = [
    {
      label: "About",
      to: "/",
    },
    {
      label: "Work",
      to: "/",
    },
    {
      label: "Projects",
      to: "/",
    },
    {
      label: "Blogs",
      to: "/",
    },
    {
      label: "Version",
      to: "/",
    },
    {
      label: "Contact",
      to: "/",
    },
  ];

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
              {socials.map((social: Social) => (
                <a
                  key={social.label}
                  href={social.to}
                  target="_blank"
                  rel="noreferrer"
                >
                  {social.icon}
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
              href="/"
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
