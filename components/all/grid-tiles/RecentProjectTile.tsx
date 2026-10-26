import { cn } from "@/lib/utils";

import Blueprint from "./project-tile/blueprint";
import Emblem from "./project-tile/emblem";
import StatusBadge from "./shared/status-badge";
import TileLabel from "./shared/tile-label";

type Props = {
  recentProject: Project | undefined;
};

const RecentProjectTile = ({ recentProject }: Props) => {
  const title = recentProject?.title ?? "Projects";
  const href =
    recentProject?.live || recentProject?.codebase || "/work#projects";

  return (
    <div
      className={cn(
        "row-span-2 lg:order-7 order-6",
        "group relative w-full min-h-80 rounded-2xl overflow-hidden card-template",
      )}
    >
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={
          recentProject ? `${title}, my latest project` : "All projects"
        }
        className="absolute inset-0 z-10 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-secondary-text/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      />

      <Blueprint />
      {recentProject && (
        <>
          <StatusBadge label="Latest project" />
          <Emblem
            icon={recentProject.icon}
            color={recentProject.backgroundColor}
            stack={recentProject.stack ?? []}
          />
        </>
      )}

      <TileLabel title={title} description={recentProject?.intro} />
    </div>
  );
};

export default RecentProjectTile;
