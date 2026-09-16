import AboutTile from "@/components/all/grid-tiles/AboutTile";
import ClientImageTile from "@/components/all/grid-tiles/ClientImageTile";
import ContactTile from "@/components/all/grid-tiles/ContactTile";
import CraftTile from "@/components/all/grid-tiles/CraftTile";
import RecentBlogTile from "@/components/all/grid-tiles/RecentBlogTile";
import RecentProjectTile from "@/components/all/grid-tiles/RecentProjectTile";
import SocialsTile from "@/components/all/grid-tiles/SocialsTile";
import SpotifyTile from "@/components/all/grid-tiles/SpotifyTile";
import UtilityTile from "@/components/all/grid-tiles/UtilityTile";
import GridWrapper from "@/components/all/GridWrapper";
import HomeSummary from "@/components/all/HomeSummary";
import PageWrapper from "@/components/PageWrapper";
import getBlogs from "@/lib/utils/get-blogs";
import getExperiences from "@/lib/utils/get-experience";
import getProjects from "@/lib/utils/get-projects";
import getSocials from "@/lib/utils/get-socials";

export default async function Home() {
  const projects = await getProjects();
  const socialsData = await getSocials();
  const blogsData = await getBlogs();
  const experiences = await getExperiences();

  const current = experiences?.find(
    (experience) => experience.currentlyWorking,
  );

  return (
    <PageWrapper>
      <GridWrapper>
        <RecentBlogTile recentBlog={blogsData?.[0]} socials={socialsData} />
        <AboutTile current={current} />
        <SocialsTile socials={socialsData} />
        <ClientImageTile />

        <SpotifyTile />
        <CraftTile />
        <RecentProjectTile recentProject={projects?.[0]} />

        <ContactTile />
        <UtilityTile />
      </GridWrapper>

      <HomeSummary />
    </PageWrapper>
  );
}
