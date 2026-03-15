import PageWrapper from "@/components/PageWrapper";
import { Sparkles } from "lucide-react";

const Crafts = (): React.JSX.Element => {
  return (
    <PageWrapper className="flex flex-col gap-8 sm:my-6 my-12">
      <div className="flex flex-col items-start text-primary gap-1">
        <h1 className="sm:text-2xl text-xl font-semibold">Crafts</h1>
        <p className="sm:text-base text-sm text-muted-foreground">
          UI experiments, animations &amp; interactive demos
        </p>
      </div>

      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div className="p-4 rounded-full bg-secondary">
          <Sparkles className="w-6 h-6 text-secondary-text" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-medium">Coming Soon</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            I&apos;m working on some creative experiments. Check back soon!
          </p>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Crafts;
