import CraftCard from "@/components/crafts/CraftCard";
import PageWrapper from "@/components/PageWrapper";
import getCraftsMedia from "@/lib/utils/get-crafts-media";

import { crafts } from "./_registry";

const Crafts = async (): Promise<React.JSX.Element> => {
  const media = await getCraftsMedia();

  return (
    <PageWrapper className="flex flex-col gap-8 sm:my-6 my-12">
      <div className="flex flex-col items-start text-primary gap-2">
        <span className="text-xs font-medium tracking-widest uppercase text-secondary-text">
          Playground
        </span>
        <h1 className="sm:text-2xl text-xl font-semibold">Crafts</h1>
        <p className="sm:text-base text-sm text-muted-foreground">
          UI experiments, animations &amp; interactive demos - where ideas get
          weird.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {crafts.map((craft) => (
          <CraftCard
            key={craft.slug}
            craft={craft}
            videoUrl={media[craft.slug]}
          />
        ))}
      </div>
    </PageWrapper>
  );
};

export default Crafts;
