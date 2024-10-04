import AboutTile from "@/components/all/grid-tiles/AboutTile";
import ContactTile from "@/components/all/grid-tiles/ContactTile";
import RecentBlogTile from "@/components/all/grid-tiles/RecentBlogTile";
import RecentProjectTile from "@/components/all/grid-tiles/RecentProjectTile";
import SocialsTile from "@/components/all/grid-tiles/SocialsTile";
import Spotify from "@/components/all/grid-tiles/SpotifyTile";
import TodoTile from "@/components/all/grid-tiles/TodoTile";
import UtilityTile from "@/components/all/grid-tiles/UtilityTile";
import GridWrapper from "@/components/all/GridWrapper";
import PageWrapper from "@/components/PageWrapper";
import dynamic from "next/dynamic";

const ImageTile = dynamic(
  () => import("@/components/all/grid-tiles/ImageTile"),
  { ssr: false }
);

export default function Home() {
  return (
    <PageWrapper>
      <GridWrapper>
        <RecentBlogTile />
        <AboutTile />
        <SocialsTile />
        <ImageTile />

        <Spotify />
        <TodoTile />
        <RecentProjectTile />

        <ContactTile />
        <UtilityTile />
      </GridWrapper>
    </PageWrapper>
  );
}
