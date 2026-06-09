import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      boxShadow: {
        chunky: "0 6px 0 rgba(0,0,0,0.12)",
        "chunky-sm": "0 4px 0 rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
