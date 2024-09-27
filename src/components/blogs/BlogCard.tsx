import { Calendar, Timer } from "lucide-react";
import React from "react";

type Props = {
  blog: Blog;
};

const BlogCard = ({ blog }: Props) => {
  const formatBlogDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <a
      href={blog.link}
      rel="noreferrer"
      target="_blank"
      className="w-full flex flex-col items-start gap-4 p-6 bg-card rounded-2xl hover:bg-muted transition-all"
    >
      <h2 className="text-base sm:text-xl text-primary font-semibold">
        {blog.title}
      </h2>
      <p className="text-xs sm:text-base leading-tight sm:leading-tight text-muted-foreground">
        {blog.description.substring(0, 200) + "..."}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
        <div className="flex items-center gap-2">
          <Calendar width={15} height={15} />
          <span className="text-muted-foreground text-xs sm:text-sm">
            {formatBlogDate(new Date(blog.publishDate))}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Timer width={15} height={15} />
          <span className="text-muted-foreground text-xs sm:text-sm">
            {blog.readTime} minutes
          </span>
        </div>
      </div>
    </a>
  );
};

export default BlogCard;
