import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  mode: "jit",
  darkMode: "class",
  plugins: [],
} satisfies Config;
