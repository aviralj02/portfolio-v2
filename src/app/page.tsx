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
import dynamic from "next/dynamic";

export default function Home() {
  return (
    <PageWrapper>
      <GridWrapper>
        <RecentBlogTile />
        <AboutTile />
        <SocialsTile />
        <ClientImageTile />

        <SpotifyTile />
        <TypingTile />
        <RecentProjectTile />

        <ContactTile />
        <UtilityTile />
      </GridWrapper>
    </PageWrapper>
  );
}
