export const crafts: Array<Craft> = [
  {
    slug: "morph-menu",
    title: "Morph Menu",
    description: "A menu popover that morphs out of its trigger",
    sourcePath: "components/crafts/morph-menu/index.tsx",
    otherSourcePaths: [
      "components/crafts/morph-menu/popover.tsx",
    ],
    writeupPath: "components/crafts/morph-menu/writeup.md",
  },
  {
    slug: "spring-counter",
    title: "Spring Counter",
    description: "A counter where digits spring in and out on change.",
    sourcePath: "components/crafts/spring-counter/index.tsx",
    writeupPath: "components/crafts/spring-counter/writeup.md",
  },
  {
    slug: "draggable-list",
    title: "Draggable List",
    description: "A sortable list where the dragged item lifts with rotation and shadow, and neighbors tilt to signal displacement.",
    sourcePath: "components/crafts/draggable-list/index.tsx",
    writeupPath: "components/crafts/draggable-list/writeup.md",
  },
];

export const getCraft = (slug: string) => crafts.find((c) => c.slug === slug);
