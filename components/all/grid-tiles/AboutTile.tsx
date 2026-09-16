"use client";

import dynamic from "next/dynamic";
import { Link } from "next-view-transitions";

import { ArrowUpRight } from "lucide-react";

import { CITY, STATE } from "@/lib/constants";
import { cn } from "@/lib/utils";

import Globe from "../Globe";

const LiveClock = dynamic(() => import("../LiveClock"), {
  ssr: false,
  loading: () => <span className="tabular-nums invisible">00:00 PM</span>,
});

type Props = {
  current?: Experience;
};

const linkClass =
  "group/link inline-flex items-baseline gap-0.5 font-medium text-foreground underline decoration-foreground/25 underline-offset-4 transition-colors hover:decoration-foreground";

const ExternalLink = ({
  href,
  children,
}: {
  href: string;
  children: string;
}) => (
  <a href={href} target="_blank" rel="noreferrer" className={linkClass}>
    {children}
    <ArrowUpRight
      aria-hidden
      className="size-3 sm:size-3.5 self-center text-muted-foreground transition-transform group-hover/link:-translate-y-px group-hover/link:translate-x-px group-hover/link:text-foreground"
    />
  </a>
);

const AboutTile = ({ current }: Props) => {
  return (
    <div
      className={cn(
        "col-span-2 row-span-2 aspect-square lg:order-2 order-1",
        "relative flex flex-col p-6 max-[359px]:p-5 sm:p-8 bg-card rounded-2xl w-full h-auto box-border overflow-hidden group card-glass",
      )}
    >
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-base sm:text-lg font-semibold tracking-tight">
            Aviral Jain
          </h1>
          <span className="text-xs sm:text-sm text-muted-foreground">
            Full Stack Engineer
          </span>
        </div>

        <div
          className="flex flex-col items-end text-xs sm:text-sm"
          title={`${CITY}, ${STATE}`}
        >
          <span className="flex items-center gap-1.5">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full rounded-full bg-emerald-500 opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
            </span>
            <LiveClock />
          </span>
          <span className="text-muted-foreground">{CITY}, India</span>
        </div>
      </div>

      <div className="relative z-10 mt-4 sm:mt-8 flex flex-col gap-2 sm:gap-4">
        <p className="text-sm max-[359px]:text-[13px] sm:text-base font-medium leading-snug tracking-tight text-pretty">
          I build products that feel effortless on the surface and stay solid
          underneath. Interfaces people enjoy using, on backends built to carry
          them.
        </p>

        <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground text-pretty">
          {current ? (
            <>
              I&apos;m a {current.role} at{" "}
              <ExternalLink href={current.url}>
                {current.companyName}
              </ExternalLink>
              .{" "}
            </>
          ) : null}
          Lately I built{" "}
          <ExternalLink href="https://skills.heyaviral.com">
            Interface Skills
          </ExternalLink>
          , agent skills for how interfaces behave, and I{" "}
          <Link href="/blogs" className={linkClass}>
            write
          </Link>{" "}
          about what I learn along the way.
        </p>
      </div>

      <div
        className={cn(
          "absolute left-1/2 -translate-x-1/2 aspect-square w-[112%] top-[70%] max-[359px]:hidden sm:w-[108%] sm:top-[56%]",
          "transition-transform duration-700 ease-out group-hover:translate-y-[-3%]",
          "mask-[linear-gradient(to_bottom,black_45%,transparent_100%)]",
        )}
      >
        <Globe />
      </div>
    </div>
  );
};

export default AboutTile;
