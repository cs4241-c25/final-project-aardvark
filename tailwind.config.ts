import type { Config } from "tailwindcss";

const defaultTheme = require('tailwindcss/defaultTheme');

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        inset: "var(--inset)",
        rank1: "var(--rank1)",
        rank2: "var(--rank2)",
        rank3: "var(--rank3)",
        rank4: "var(--rank4)",
      },
      fontFamily: {
        funnel: ['Funnel Display', ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        pop: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        pop: "pop 0.2s ease-in-out",
      }
    },
  },
  plugins: [],
} satisfies Config;
