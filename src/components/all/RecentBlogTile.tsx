import { RssIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {};

const RecentBlogTile = (props: Props) => {
  return (
    <div className="flex flex-col row-span-2 justify-between h-full w-full box-border group bg-card-gradient p-6 rounded-3xl">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <RssIcon height={17} width={17} />
          <h2 className="text-base font-semibold">Recent Blog</h2>
        </div>

        <img
          src="https://miro.medium.com/v2/resize:fit:828/format:webp/1*2317nZaYt9AxhfrATgGAwg.png"
          alt="blog-thumbnail"
          className="opacity-70 group-hover:opacity-100 transition-all rounded-md"
          draggable={false}
        />

        <div className="flex flex-col items-start">
          <h3 className="text-base">Setting up Express.js with Typescript</h3>
          <span className="text-sm text-dim">July 19, 2023</span>
        </div>
      </div>

      <Link
        href="/"
        className="bg-background text-center text-xs rounded-full py-2 border border-input hover:bg-accent transition-all"
      >
        Read More
      </Link>
    </div>
  );
};

export default RecentBlogTile;
