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
				gameBlue: "var(--game-blue)",
				gameGreen: "var(--game-green)",
				gameYellow: "var(--game-yellow)",
				gameRed: "var(--game-red)",
			},
			fontFamily: {
				funnel: ['Funnel Display', ...defaultTheme.fontFamily.sans],
			},
		},
	}
} satisfies Config;