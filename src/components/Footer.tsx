import React, { ReactElement } from "react";
import GithubIcon from "./icons/GithubIcon";
import LinkedInIcon from "./icons/LinkedInIcon";
import MediumIcon from "./icons/MediumIcon";
import Link from "next/link";

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
      icon: <GithubIcon width={22} height={22} />,
      to: "/",
    },
    {
      label: "linkedin",
      icon: <LinkedInIcon width={22} height={22} />,
      to: "/",
    },
    {
      label: "medium",
      icon: <MediumIcon width={22} height={22} />,
      to: "/",
    },
    {
      label: "github",
      icon: <GithubIcon width={22} height={22} />,
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

      <div className="flex flex-col sm:flex-row justify-between mt-12 px-6 sm:h-44">
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

        <div className="flex flex-col gap-4 sm:gap-6 flex-wrap text-dim font-semibold mt-6 sm:m-0">
          {footerLinks.map((link: FooterLink) => (
            <Link
              key={link.label}
              href="/"
              className="hover:text-primary transition-all duration-300 md:ml-14"
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
