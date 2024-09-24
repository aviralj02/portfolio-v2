"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Navbar from "./Navbar";
import { useTheme } from "next-themes";

type Props = {};

const Header = (props: Props) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-screen-xl flex items-center justify-center md:justify-between mx-auto py-8 px-2.5 md:px-20">
      <img
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        src="https://avatars.githubusercontent.com/u/90745037?s=400&u=5c3bdccd16d1092002f4c1895249dac781b33ba1&v=4"
        alt="header-photo"
        width={45}
        height={45}
        className="rounded-full hidden md:block"
      />

      <Navbar />

      <Link
        href={"/contact"}
        className="md:flex hidden gap-1 items-center font-medium text-sm group"
        aria-label="contact-button"
      >
        <span>Contact</span>{" "}
        <ArrowUpRight className="w-4 transform group-hover:rotate-45 transition ease-in" />
      </Link>
    </div>
  );
};

export default Header;
