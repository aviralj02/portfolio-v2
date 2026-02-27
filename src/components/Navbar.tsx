"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavLink = {
  label: string;
  route: string;
};

const navLinks: Array<NavLink> = [
  { label: "All", route: "/" },
  { label: "Work", route: "/work" },
  { label: "Projects", route: "/projects" },
  { label: "Blogs", route: "/blogs" },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <motion.div
      layout
      className="fixed top-6 left-0 right-0 z-50 flex justify-center"
    >
      <div className="rounded-full p-0.5 nav-glass-ring">
        <nav className="rounded-full px-1 py-1 nav-glass-body">
          <ul className="flex gap-0.5 list-none">
            {navLinks.map((link: NavLink) => (
              <li key={link.label} className="relative py-[6px] px-5">
                <Link
                  href={link.route}
                  className={cn(
                    "text-sm font-medium transition-opacity duration-200 relative z-10 block",
                    pathname !== link.route
                      ? "opacity-60 hover:opacity-90"
                      : "opacity-100"
                  )}
                >
                  {link.label}
                </Link>

                {pathname === link.route && (
                  <motion.div
                    className="absolute inset-0 -z-0 rounded-full nav-glass-pill"
                    layoutId="active-pill"
                    layoutScroll
                    initial={{ scaleY: 2.5 }}
                    animate={{ scaleY: 1 }}
                    exit={{ scaleY: 2.5 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 50,
                    }}
                  />
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </motion.div>
  );
};

export default Navbar;
