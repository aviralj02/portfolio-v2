/* Ruled paper behind the post: faint lines with a margin rule, densest
   behind the page and fading out towards the edges. */
const Ruled = () => (
  <div
    aria-hidden
    className="absolute inset-0 pointer-events-none text-foreground opacity-[0.09]"
    style={{
      backgroundImage:
        "linear-gradient(to right, transparent 27%, currentColor 27%, currentColor calc(27% + 1px), transparent calc(27% + 1px)), repeating-linear-gradient(to bottom, transparent 0 11px, currentColor 11px 12px)",
      maskImage:
        "radial-gradient(ellipse 60% 55% at 50% 40%, black, transparent)",
    }}
  />
);

export default Ruled;
