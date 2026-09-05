export const crafts: Array<Craft> = [
  {
    slug: "liquid-input",
    title: "Liquid Input",
    description:
      "An input whose surface melts into whatever sits beside it - the gap between them decides if they read as one shape or two.",
    sourcePath: "components/crafts/liquid-input/index.tsx",
    otherSourcePaths: ["components/crafts/liquid-input/liquid.tsx"],
    writeupPath: "components/crafts/liquid-input/writeup.md"
  },
  {
    slug: "draggable-list",
    title: "Draggable List",
    description:
      "A sortable list where the dragged item lifts with rotation and shadow, and neighbors tilt to signal displacement.",
    sourcePath: "components/crafts/draggable-list/index.tsx",
    writeupPath: "components/crafts/draggable-list/writeup.md"
  },
  {
    slug: "morph-menu",
    title: "Morph Menu",
    description: "A menu popover that morphs out of its trigger",
    sourcePath: "components/crafts/morph-menu/index.tsx",
    otherSourcePaths: ["components/crafts/morph-menu/popover.tsx"],
    writeupPath: "components/crafts/morph-menu/writeup.md"
  },
  {
    slug: "spring-counter",
    title: "Spring Counter",
    description: "A counter where digits spring in and out on change.",
    sourcePath: "components/crafts/spring-counter/index.tsx",
    writeupPath: "components/crafts/spring-counter/writeup.md"
  }
];

export const getCraft = (slug: string) => crafts.find((c) => c.slug === slug);
