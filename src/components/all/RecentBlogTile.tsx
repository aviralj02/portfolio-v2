import { RssIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {};

const RecentBlogTile = (props: Props) => {
  return (
    <div className="flex flex-col row-span-2 justify-between w-full box-border bg-card-gradient p-6 rounded-2xl lg:order-1 order-2"></div>
  );
};

export default RecentBlogTile;
