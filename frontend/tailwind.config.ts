import type { Config } from "tailwindcss";

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
      },
      fontFamily: {
        sans: ['Hauss', 'sans-serif'],
      },
      fontWeight: {
        bookitalic: '400',
        hairline: '100',
        light: '300',
        regular: '400',
        medium: '500',
        thin: '200',
      },
    },
  },
  plugins: [],
} satisfies Config;
