import BlogCard from "@/components/blogs/BlogCard";
import PageWrapper from "@/components/PageWrapper";
import React from "react";

type Props = {};

type BlogType = {
  title: string;
  description: string;
  publishedAt: string;
  readTime: number;
  link: string;
};

const Blogs = (props: Props) => {
  const blogs: BlogType[] = [
    {
      title:
        "Setting Up Express with TypeScript: Adding Prisma for Database Operations",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever si",
      publishedAt: "Sept 24, 2024",
      readTime: 8,
      link: "/",
    },
    {
      title:
        "Setting Up Express with TypeScript: Adding Prisma for Database Operations",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever si",
      publishedAt: "Sept 24, 2024",
      readTime: 8,
      link: "/",
    },
    {
      title:
        "Setting Up Express with TypeScript: Adding Prisma for Database Operations",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever si",
      publishedAt: "Sept 24, 2024",
      readTime: 8,
      link: "/",
    },
  ];

  return (
    <PageWrapper className="flex flex-col gap-8 sm:my-12 my-6">
      <div className="flex flex-col items-start text-primary gap-1">
        <h1 className="sm:text-2xl text-xl font-medium">Blogs</h1>
        <p className="sm:text-base text-sm text-muted-foreground">
          I share my experiences as a developer, writing blogs on various
          technologies
        </p>
      </div>

      <div className="w-full flex flex-col gap-6">
        {blogs.map((blog: BlogType) => (
          <BlogCard key={blog.title} blog={blog} />
        ))}
      </div>
    </PageWrapper>
  );
};

export default Blogs;
