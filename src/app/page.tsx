import AboutTile from "@/components/all/AboutTile";
import GridWrapper from "@/components/all/GridWrapper";
import RecentBlogTile from "@/components/all/RecentBlogTile";
import RecentProjectTile from "@/components/all/RecentProjectTile";
import ResumeTile from "@/components/all/ResumeTile";
import SocialsTile from "@/components/all/SocialsTile";
import Spotify from "@/components/all/Spotify";
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
        <div className="bg-card rounded-2xl col-span-2 order-5">hello</div>
        <RecentProjectTile />
        <div className="bg-card rounded-2xl col-span-2 lg:order-8 order-9">
          hello
        </div>
        <div className="bg-card rounded-2xl aspect-square lg:order-9 order-8">
          hello
        </div>
      </GridWrapper>
    </PageWrapper>
  );
}
