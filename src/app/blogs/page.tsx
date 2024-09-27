"use client";

import BlogCard from "@/components/blogs/BlogCard";
import PageWrapper from "@/components/PageWrapper";
import getBlogs from "@/lib/utils/get-blogs";
import React, { ReactElement, useEffect, useState } from "react";

type Props = {};

const Blogs = (props: Props): ReactElement => {
  const [blogs, setBlogs] = useState<Blog[]>();

  const fetchBlogs = async () => {
    const blogsData = await getBlogs();
    setBlogs(blogsData);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <PageWrapper className="flex flex-col gap-8 sm:my-12 my-6">
      <div className="flex flex-col items-start text-primary gap-1">
        <h1 className="sm:text-2xl text-xl font-medium">Blogs</h1>
        <p className="sm:text-base text-sm text-muted-foreground">
          I share my experiences as a developer, writing blogs on various topics
        </p>
      </div>

      <div className="w-full flex flex-col gap-6">
        {blogs?.map((blog: Blog) => (
          <BlogCard key={blog.title} blog={blog} />
        ))}
      </div>
    </PageWrapper>
  );
};

export default Blogs;
