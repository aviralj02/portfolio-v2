import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import Navbar from "./Navbar";
import Image from "next/image";

type Props = {};

const Header = (props: Props) => {
  return (
    <div className="max-w-screen-xl flex items-center justify-center md:justify-between mx-auto py-8 px-2.5 md:px-20">
      <Link href="/">
        <Image
          src="/assets/profile-image.png"
          alt="header-photo"
          width={45}
          height={45}
          priority
          className="rounded-full hidden md:block"
        />
      </Link>

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
