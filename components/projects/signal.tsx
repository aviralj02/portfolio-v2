type Props = {
  color?: string;
};

const Signal = ({ color = "currentColor" }: Props) => (
  <div
    aria-hidden
    className="absolute inset-0 pointer-events-none text-foreground"
    style={{
      backgroundImage: [
        `radial-gradient(circle at 50% 50%, color-mix(in srgb, ${color} 28%, transparent), transparent 55%)`,
        "repeating-radial-gradient(circle at 50% 50%, transparent 0 15px, color-mix(in srgb, currentColor 6%, transparent) 15px 16px)",
      ].join(", "),
      filter: "blur(1px)",
      maskImage:
        "radial-gradient(ellipse 60% 85% at 50% 50%, black 30%, transparent)",
    }}
  />
);

export default Signal;
