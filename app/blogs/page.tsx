import BlogList from "@/components/blogs/BlogList";
import BlogMasthead from "@/components/blogs/BlogMasthead";
import PageWrapper from "@/components/PageWrapper";
import { archiveSpan } from "@/lib/blogs";
import getBlogs from "@/lib/utils/get-blogs";
import getSocials from "@/lib/utils/get-socials";

const Blogs = async (): Promise<React.JSX.Element> => {
  const [blogsData, socials] = await Promise.all([getBlogs(), getSocials()]);

  const blogs = blogsData ?? [];
  const medium = socials?.find((social) => social.name.toLowerCase() === "medium");

  return (
    <PageWrapper>
      <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[18rem_minmax(0,46rem)] lg:gap-x-16">
        <BlogMasthead
          count={blogs.length}
          span={archiveSpan(blogs)}
          mediumUrl={medium?.url}
        />

        <BlogList blogs={blogs} />
      </div>
    </PageWrapper>
  );
};

export default Blogs;
