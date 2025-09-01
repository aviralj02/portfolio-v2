import AboutTile from "@/components/all/grid-tiles/AboutTile";
import ClientImageTile from "@/components/all/grid-tiles/ClientImageTile";
import ContactTile from "@/components/all/grid-tiles/ContactTile";
import RecentBlogTile from "@/components/all/grid-tiles/RecentBlogTile";
import RecentProjectTile from "@/components/all/grid-tiles/RecentProjectTile";
import SocialsTile from "@/components/all/grid-tiles/SocialsTile";
import SpotifyTile from "@/components/all/grid-tiles/SpotifyTile";
import TypingTile from "@/components/all/grid-tiles/TypingTile";
import UtilityTile from "@/components/all/grid-tiles/UtilityTile";
import GridWrapper from "@/components/all/GridWrapper";
import PageWrapper from "@/components/PageWrapper";
import getBlogs from "@/lib/utils/get-blogs";
import getProjects from "@/lib/utils/get-projects";
import getSocials from "@/lib/utils/get-socials";

export default async function Home() {
  const projects = await getProjects();
  const socialsData = await getSocials();
  const blogsData = await getBlogs();

  return (
    <PageWrapper>
      <GridWrapper>
        <RecentBlogTile recentBlog={blogsData?.[0]} socials={socialsData} />
        <AboutTile />
        <SocialsTile socials={socialsData} />
        <ClientImageTile />

        <SpotifyTile />
        <TypingTile />
        <RecentProjectTile recentProject={projects?.[0]} />

        <ContactTile />
        <UtilityTile />
      </GridWrapper>
    </PageWrapper>
  );
}
