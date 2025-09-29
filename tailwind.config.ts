import type { Config } from "tailwindcss";

// tailwind.config.ts
const config: Config = {
  darkMode: "class", // ✅ harus ada
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: { extend: {} },
  plugins: [],
};


export default config;
