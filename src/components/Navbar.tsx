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
  { label: "Craft", route: "/craft" },
  { label: "Blogs", route: "/blogs" },
];

const isRouteActive = (pathname: string, route: string) =>
  route === "/"
    ? pathname === "/"
    : pathname === route || pathname.startsWith(`${route}/`);

const Navbar = () => {
  const pathname = usePathname();
  const [activeTabHovered, setActiveTabHovered] = useState(false);

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
            {baseNavLinks.map((link: NavLink) => {
              const active = isRouteActive(pathname, link.route);
              const nested =
                active && link.route !== "/" && pathname !== link.route;

              return (
                <motion.li
                  key={link.label}
                  className="relative py-[6px] px-5"
                  onHoverStart={
                    active ? () => setActiveTabHovered(true) : undefined
                  }
                  onHoverEnd={
                    active ? () => setActiveTabHovered(false) : undefined
                  }
                >
                  <Link
                    href={link.route}
                    className={cn(
                      "text-sm font-medium transition-colors duration-200 relative z-10 flex items-center gap-1.5",
                      !active
                        ? "text-primary/60 hover:text-primary"
                        : "text-primary"
                    )}
                  >
                    {link.label}

                    {nested && (
                      <motion.span
                        key="nested-dot"
                        aria-hidden
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 22,
                        }}
                        className="inline-block size-1 rounded-full bg-emerald-500/70"
                      />
                    )}
                  </Link>

                  {active && (
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
                          stiffness: 360,
                          damping: 26,
                        },
                        duration: 0.3,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                </motion.li>
              );
            })}
          </ul>
        </motion.nav>
      </div>
    </motion.div>
  );
};

export default Navbar;
