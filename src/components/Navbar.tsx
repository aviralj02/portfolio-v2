"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

type NavLink = {
  label: string;
  route: string;
};

const baseNavLinks: Array<NavLink> = [
  { label: "All", route: "/" },
  { label: "Work", route: "/work" },
  { label: "Projects", route: "/projects" },
  { label: "Blogs", route: "/blogs" },
];

const Navbar = () => {
  const pathname = usePathname();
  const [activeTabHovered, setActiveTabHovered] = useState(false);

  const navLinks = pathname.startsWith("/craft")
    ? [...baseNavLinks, { label: "Craft", route: "/craft" }]
    : baseNavLinks;

  return (
    <motion.div
      layoutScroll
      className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none"
    >
      <div className="rounded-full p-0.5 nav-glass-ring pointer-events-auto">
        <motion.nav
          layout
          layoutRoot
          className="rounded-full px-1 py-1 nav-glass-body"
        >
          <ul className="flex gap-0.5 list-none">
            {navLinks.map((link: NavLink) => (
              <motion.li
                key={link.label}
                className="relative py-[6px] px-5"
                onHoverStart={
                  pathname === link.route
                    ? () => setActiveTabHovered(true)
                    : undefined
                }
                onHoverEnd={
                  pathname === link.route
                    ? () => setActiveTabHovered(false)
                    : undefined
                }
              >
                <Link
                  href={link.route}
                  className={cn(
                    "text-sm font-medium transition-colors duration-200 relative z-10 block",
                    pathname !== link.route
                      ? "text-primary/60 hover:text-primary"
                      : "text-primary"
                  )}
                >
                  {link.label}
                </Link>

                {pathname === link.route && (
                  <motion.div
                    className="absolute inset-0 z-0 rounded-full nav-glass-pill"
                    layoutId="active-pill"
                    animate={{
                      scaleX: activeTabHovered ? 1.06 : 1,
                      scaleY: activeTabHovered ? 1.08 : 1,
                    }}
                    transition={{
                      layout: {
                        type: "spring",
                        stiffness: 400,
                        damping: 32,
                      },
                      duration: 0.3,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </motion.li>
            ))}
          </ul>
        </motion.nav>
      </div>
    </motion.div>
  );
};

export default Navbar;
