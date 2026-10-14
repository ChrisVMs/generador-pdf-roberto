import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#b8860b", dark: "#8a6508", light: "#f6edd5" },
      },
    },
  },
  plugins: [],
} satisfies Config;
