"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Props = {};

type NavLink = {
  label: string;
  route: string;
};

const Navbar = (props: Props) => {
  const pathname = usePathname();

  const navLinks: NavLink[] = [
    {
      label: "All",
      route: "/",
    },
    {
      label: "Work",
      route: "/work",
    },
    {
      label: "Projects",
      route: "/projects",
    },
    {
      label: "Blogs",
      route: "/blogs",
    },
  ];

  return (
    <nav className="shadow-navShadow rounded-full">
      <ul className="flex gap-1 sm:gap-4 list-none">
        {navLinks.map((link: NavLink) => (
          <li key={link.label} className="relative py-[6px] px-5">
            <Link
              href={link.route}
              className={cn(
                "text-sm font-medium transition-all duration-300",
                pathname !== link.route ? "hover:opacity-65" : ""
              )}
            >
              {link.label}
            </Link>
            {pathname === link.route ? (
              <motion.div
                className="absolute right-0 left-0 top-0 bg-card h-full -z-10 rounded-3xl"
                layoutId="active"
                transition={{ type: "spring", stiffness: 270, damping: 30 }}
              />
            ) : null}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
