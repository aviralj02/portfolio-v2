export const crafts: Array<Craft> = [
  {
    slug: "spring-counter",
    title: "Spring Counter",
    description: "A counter where digits spring in and out on change.",
    gif: "/crafts/spring-counter.gif",
    sourcePath: "src/components/crafts/spring-counter/index.tsx",
    writeupPath: "src/components/crafts/spring-counter/writeup.md",
  },
];

export const getCraft = (slug: string) => crafts.find((c) => c.slug === slug);
