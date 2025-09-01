import { useTheme } from "next-themes";
import React, { FC, ReactElement } from "react";

type Props = {
  className?: string;
};

const PageoIcon: FC<Props> = ({ className }: Props): ReactElement => {
  const { theme } = useTheme();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      zoomAndPan="magnify"
      viewBox="0 0 375 374.999991"
      preserveAspectRatio="xMidYMid meet"
      version="1.0"
      className={className}
    >
      <title>Pageo</title>
      <path
        fill={theme === "light" ? "black" : "white"}
        d="M 324.714844 137.515625 C 269.128906 148.441406 263.117188 151.394531 253.21875 201.871094 C 240.304688 267.722656 151.53125 207.359375 137.808594 272.441406 C 136 281.019531 116.058594 375.59375 48.253906 335.554688 C 14.429688 315.582031 0.339844 131.222656 112.832031 81.964844 C 300.019531 0 402.910156 122.148438 324.714844 137.515625 Z M 324.714844 137.515625 "
        fillOpacity="1"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default PageoIcon;
