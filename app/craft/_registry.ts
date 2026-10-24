export const crafts: Array<Craft> = [
  {
    slug: "wave-loader",
    title: "Wave Loader",
    description:
      "A save button whose label is its loader - the letters thin into bars that tip like dominoes while it works, then blur into a saved state.",
    sourcePath: "components/crafts/wave-loader/index.tsx",
    writeupPath: "components/crafts/wave-loader/writeup.md"
  },
  {
    slug: "vanish-input",
    title: "Vanish Input",
    description:
      "A search field that eats your query - press Enter and the text breaks into pixels that stream back into the magnifier.",
    sourcePath: "components/crafts/vanish-input/index.tsx",
    writeupPath: "components/crafts/vanish-input/writeup.md"
  },
  {
    slug: "generative-grid",
    title: "Generative Grid",
    description:
      "A photo that builds itself out of a grid - dashed cuts split the frame, blurry pieces land tile by tile, then the whole thing comes into focus.",
    sourcePath: "components/crafts/generative-grid/index.tsx",
    writeupPath: "components/crafts/generative-grid/writeup.md"
  },
  {
    slug: "record-waveform",
    title: "Record Waveform",
    description:
      "A record button with its waveform bent into a ring - tap it and eight dashes open around it, stretching and shrinking like a voice.",
    sourcePath: "components/crafts/record-waveform/index.tsx",
    writeupPath: "components/crafts/record-waveform/writeup.md"
  },
  {
    slug: "process-button",
    title: "Process Button",
    description:
      "A button that runs its own progress - start it and a stop button buds off its side like a droplet, then melts back in when the work ends.",
    sourcePath: "components/crafts/process-button/index.tsx",
    writeupPath: "components/crafts/process-button/writeup.md"
  },
  {
    slug: "peel-button",
    title: "Peel Button",
    description:
      "A button that's really a sticker - hover and its corner curls back off the layer underneath, press and it pulls a little further.",
    sourcePath: "components/crafts/peel-button/index.tsx",
    writeupPath: "components/crafts/peel-button/writeup.md"
  },
  {
    slug: "copy-tabs",
    title: "Copy Tabs",
    description:
      "A copy button split into three tabs - what it holds, what a click does, and that it worked - with only one ever open.",
    sourcePath: "components/crafts/copy-tabs/index.tsx",
    writeupPath: "components/crafts/copy-tabs/writeup.md"
  },
  {
    slug: "segmented-nav",
    title: "Segmented Nav",
    description:
      "A navigation track of ticks - pick one and it stretches into a labeled pill while its neighbors fade out with distance.",
    sourcePath: "components/crafts/segmented-nav/index.tsx",
    writeupPath: "components/crafts/segmented-nav/writeup.md"
  },
  {
    slug: "quick-switch",
    title: "Quick Switch",
    description:
      "A prompt bar with a mode pill - tap it and the icon blurs into the next one while the placeholder rewrites itself letter by letter.",
    sourcePath: "components/crafts/quick-switch/index.tsx",
    otherSourcePaths: ["components/crafts/quick-switch/morph-text.tsx"],
    writeupPath: "components/crafts/quick-switch/writeup.md"
  },
  {
    slug: "zipper-coupon",
    title: "Zipper Coupon",
    description:
      "A coupon pouch sealed with a zip - drag the pull and the fabric peels open along a curve, then the ticket inside pops out.",
    sourcePath: "components/crafts/zipper-coupon/index.tsx",
    otherSourcePaths: [
      "components/crafts/zipper-coupon/zipper.tsx",
      "components/crafts/zipper-coupon/ticket.tsx"
    ],
    writeupPath: "components/crafts/zipper-coupon/writeup.md"
  },
  {
    slug: "otp-input",
    title: "OTP Input",
    description:
      "A one-time code field where digits spring into place, backspace walks you back and a paste fills it in one go.",
    sourcePath: "components/crafts/otp-input/index.tsx",
    writeupPath: "components/crafts/otp-input/writeup.md"
  },
  {
    slug: "cloud-status",
    title: "Cloud Status",
    description:
      "A status that drifts up off an avatar - as a thought, puffs rolling into a cloud, or as a message, a bubble whose tail was the puffs all along.",
    sourcePath: "components/crafts/cloud-status/index.tsx",
    otherSourcePaths: ["components/crafts/cloud-status/cloud.tsx"],
    writeupPath: "components/crafts/cloud-status/writeup.md"
  },
  {
    slug: "wobble-tabs",
    title: "Wobble Tabs",
    description:
      "Tabs that trade width for attention - the chosen one springs open past its own size to let its label in, the last one folds back to an icon.",
    sourcePath: "components/crafts/wobble-tabs/index.tsx",
    otherSourcePaths: ["components/crafts/wobble-tabs/tabs.tsx"],
    writeupPath: "components/crafts/wobble-tabs/writeup.md"
  },
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
