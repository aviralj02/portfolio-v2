import { cn } from "@/lib/utils";
import { TagSize } from "@/types/enums";
import { useTheme } from "next-themes";

type Props = {
  name: string;
  size: TagSize;
};

const Tag = ({ name, size }: Props) => {
  const { theme } = useTheme();

  const baseSize =
    size === TagSize.Small ? "text-[10px] md:text-xs" : "text-xs md:text-sm";

  const isDark = theme === "dark";

  return (
    <div
      className={cn(
        baseSize,
        "relative py-[6px] px-5 rounded-xl select-none tracking-wide",
        "bg-background border border-dim/60 shadow-inner",
        "transition-all duration-300 ease-out",
        "hover:shadow-[0_0_12px_rgba(0,0,0,0.15)] hover:-translate-y-[2px]",
        "overflow-hidden"
      )}
    >
      <span className="relative z-20">{name}</span>

      {isDark && (
        <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-40" />
      )}

      {isDark && (
        <div
          className="absolute left-1/2 -bottom-7 w-1/2 h-7 bg-primary/60 rounded-full blur-lg opacity-70 transition-all duration-300 ease-out group-hover:opacity-100
          "
        />
      )}

      <div className="absolute inset-x-0 -top-[1px] h-[1px] bg-white/10 pointer-events-none" />
    </div>
  );
};

export default Tag;
