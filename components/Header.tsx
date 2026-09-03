import Image from "next/image";
import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import LocalTime from "./LocalTime";
import Navbar from "./Navbar";
import ThemeSwitch from "./ThemeSwitch";

const Header = () => {
  return (
    <div className="max-w-7xl w-full flex items-center justify-between mx-auto py-7 px-5 md:px-20">
      <div className="hidden md:flex items-center gap-4">
        <Link href="/" className="relative shrink-0" aria-label="Home">
          <div className="relative shadow-sm rounded-full">
            <Image
              src="/assets/profile-image.png"
              alt="profile-image"
              width={38}
              height={38}
              priority
              draggable={false}
              className="rounded-full"
            />
          </div>

          <span
            className="absolute bottom-0 right-0 size-2 rounded-full bg-emerald-500 ring-2 ring-background"
            aria-label="Available"
          >
            <span className="absolute inset-0 rounded-full bg-emerald-500 opacity-60 animate-ping" />
          </span>
        </Link>

        <LocalTime />
      </div>

      <Navbar />

      {/* Sits at the right edge on its own on mobile, where the rest of this
          row is hidden — the footer's toggle was `hidden sm:grid`, so small
          screens previously had no way to switch theme off the home page. */}
      <div className="flex items-center gap-5 ml-auto">
        <ThemeSwitch />

        <Link
          href={"/#contact"}
          className="md:flex hidden gap-1 items-center font-semibold text-sm tracking-tight text-foreground/90 hover:text-foreground group transition-colors"
          aria-label="contact-button"
        >
          <span>Contact</span>{" "}
          <ArrowUpRight className="w-4 stroke-[2.5] transform group-hover:rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform ease-out duration-200" />
        </Link>
      </div>
    </div>
  );
};

export default Header;
