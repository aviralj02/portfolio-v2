import CraftCard from "@/components/crafts/CraftCard";
import craftsTitle from "@/components/crafts/crafts-title-paths";
import PageWrapper from "@/components/PageWrapper";
import PenTitle from "@/components/PenTitle";
import getCraftsMedia from "@/lib/utils/get-crafts-media";

import { crafts } from "./_registry";

const Crafts = async (): Promise<React.JSX.Element> => {
  const media = await getCraftsMedia();

  return (
    <PageWrapper className="flex flex-col gap-8">
      <div className="flex flex-col items-start gap-2 text-primary">
        <span className="text-xs font-medium uppercase tracking-widest text-secondary-text">
          Playground
        </span>

        <PenTitle title={craftsTitle} />

        <p className="w-full max-w-[58ch] text-pretty text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
          UI experiments, animations and interactive demos — where ideas get
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
