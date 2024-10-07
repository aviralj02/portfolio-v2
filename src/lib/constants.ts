import { MotionProps } from "framer-motion";

export const PORTFOLIO_URL: string = "https://aviral.xyz";
export const PORTFOLIO_DESC: string =
  "Welcome to my personal portfolio where you will find a comprehensive overview of my skills as a full stack developer. Explore my work experience, showcasing impactful contributions and projects from my internships and roles. Discover key projects that demonstrate my capabilities, along with insightful blogs sharing my thoughts on technology and web development trends.";

export const footerLinks: FooterLink[] = [
  {
    label: "About",
    to: "/",
  },
  {
    label: "Work",
    to: "/work",
  },
  {
    label: "Projects",
    to: "/projects",
  },
  {
    label: "Blogs",
    to: "/blogs",
  },
  {
    label: "Theme",
    to: "/#theme",
  },
  {
    label: "Contact",
    to: "/#contact",
  },
];

export const typingProps: Record<
  string,
  {
    initial?: MotionProps["initial"];
    animate?: MotionProps["animate"];
    exit?: MotionProps["exit"];
    transition?: MotionProps["transition"];
  }
> = {
  "slide-up": {
    initial: { opacity: 0, y: 100, rotate: 45 },
    animate: { opacity: 1, y: 0, rotate: 0 },
    exit: { opacity: 0, y: 100, rotate: 45, transition: { duration: 0.15 } },
    transition: { duration: 0.3, ease: "easeIn" },
  },
  bouncing: {
    initial: { opacity: 0, y: -50, scale: 0.8 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 50, scale: 0.8, transition: { duration: 0.2 } },
    transition: { duration: 0.5, ease: "easeOut" },
  },
  "fade-zoom": {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
    transition: { duration: 0.4, ease: "easeInOut" },
  },
  wave: {
    initial: { opacity: 0, x: -100, rotate: -10 },
    animate: { opacity: 1, x: 0, rotate: 0 },
    exit: { opacity: 0, x: -100, rotate: 10, transition: { duration: 0.2 } },
    transition: { duration: 0.7, ease: [0.6, -0.05, 0.01, 0.99] },
  },
};
