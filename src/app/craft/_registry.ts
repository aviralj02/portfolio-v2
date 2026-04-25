export const crafts: Array<Craft> = [
  {
    slug: "spring-counter",
    title: "Spring Counter",
    description: "A counter where digits spring in and out on change.",
    sourcePath: "src/components/crafts/spring-counter/index.tsx",
    writeupPath: "src/components/crafts/spring-counter/writeup.md",
  },
  {
    slug: "blob-menu",
    title: "Blob Menu",
    description: "A messages card that morphs out of its trigger using an SVG filter.",
    sourcePath: "src/components/crafts/blob-menu/index.tsx",
    writeupPath: "src/components/crafts/blob-menu/writeup.md",
  },
];

export const getCraft = (slug: string) => crafts.find((c) => c.slug === slug);
