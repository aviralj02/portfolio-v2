import Image from "next/image";
import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import Navbar from "./Navbar";

const Header = () => {
  return (
    <div className="max-w-7xl flex items-center justify-between mx-auto py-7 px-2.5 md:px-20">
      <Link href="/">
        <Image
          src="/assets/profile-image.png"
          alt="profile-image"
          width={40}
          height={40}
          priority
          draggable={false}
          className="rounded-full hidden md:block"
        />
      </Link>

      <Navbar />

      <Link
        href={"/#contact"}
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
