export const crafts: Array<Craft> = [
  {
    slug: "spring-counter",
    title: "Spring Counter",
    description: "A counter where digits spring in and out on change.",
    sourcePath: "src/components/crafts/spring-counter/index.tsx",
    writeupPath: "src/components/crafts/spring-counter/writeup.md",
  },
  {
    slug: "morph-menu",
    title: "Morph Menu",
    description: "A messages card that morphs out of its trigger using an SVG filter.",
    sourcePath: "src/components/crafts/morph-menu/index.tsx",
    otherSourcePaths: [
      "src/components/crafts/morph-menu/popover.tsx",
    ],
    writeupPath: "src/components/crafts/morph-menu/writeup.md",
  },
];

export const getCraft = (slug: string) => crafts.find((c) => c.slug === slug);
