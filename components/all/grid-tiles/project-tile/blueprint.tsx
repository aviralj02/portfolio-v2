/* Drafting grid behind the project: fine squares with a heavier line every
   fourth, densest behind the icon and fading out towards the edges. */
const Blueprint = () => (
  <div
    aria-hidden
    className="absolute inset-0 pointer-events-none text-foreground"
    style={{
      backgroundImage: [
        "linear-gradient(to right, color-mix(in srgb, currentColor 10%, transparent) 1px, transparent 1px)",
        "linear-gradient(to bottom, color-mix(in srgb, currentColor 10%, transparent) 1px, transparent 1px)",
        "linear-gradient(to right, color-mix(in srgb, currentColor 5%, transparent) 1px, transparent 1px)",
        "linear-gradient(to bottom, color-mix(in srgb, currentColor 5%, transparent) 1px, transparent 1px)",
      ].join(", "),
      backgroundSize: "48px 48px, 48px 48px, 12px 12px, 12px 12px",
      backgroundPosition: "center",
      maskImage:
        "radial-gradient(ellipse 60% 50% at 50% 40%, black, transparent)",
    }}
  />
);

export default Blueprint;
