import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        dim: "hsl(var(--dim))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          text: "hsl(var(--secondary-text))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        navShadow: "var(--navShadow)",
      },
      backgroundImage: {
        "card-gradient": "var(--card-gradient)",
      },

      keyframes: {
        quiet: {
          "25%": { transform: "scaleY(0.6)" },
          "50%": { transform: "scaleY(0.4)" },
          "75%": { transform: "scaleY(0.8)" },
        },
        decent: {
          "25%": { transform: "scaleY(1)" },
          "50%": { transform: "scaleY(0.4)" },
          "75%": { transform: "scaleY(0.6)" },
        },
        loud: {
          "25%": { transform: "scaleY(1)" },
          "50%": { transform: "scaleY(0.4)" },
          "75%": { transform: "scaleY(1.2)" },
        },
      },
      animation: {
        quiet: "quiet 1s infinite",
        decent: "decent 1s infinite",
        loud: "loud 1s infinite",
      },
    },
  },
  safelist: ["card-shadow"],
  plugins: [],
};
export default config;
