import AboutTile from "@/components/all/grid-tiles/AboutTile";
import RecentBlogTile from "@/components/all/grid-tiles/RecentBlogTile";
import RecentProjectTile from "@/components/all/grid-tiles/RecentProjectTile";
import ResumeTile from "@/components/all/grid-tiles/ResumeTile";
import SocialsTile from "@/components/all/grid-tiles/SocialsTile";
import Spotify from "@/components/all/grid-tiles/SpotifyTile";
import TodoTile from "@/components/all/grid-tiles/TodoTile";
import UtilityTile from "@/components/all/grid-tiles/UtilityTile";
import GridWrapper from "@/components/all/GridWrapper";
import PageWrapper from "@/components/PageWrapper";

export default function Home() {
  return (
    <PageWrapper>
      <GridWrapper>
        <RecentBlogTile />
        <AboutTile />
        <SocialsTile />
        <ResumeTile />

        <Spotify />
        <TodoTile />
        <RecentProjectTile />

        <div className="bg-card rounded-2xl col-span-2 lg:order-8 order-9">
          hello
        </div>
        <UtilityTile />
      </GridWrapper>
    </PageWrapper>
  );
}
