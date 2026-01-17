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
        // Sentinel DLP "Sith" Palette
        c2: {
          bg: "#050505",       // Deep Black
          paper: "#0c0c0c",    // Panel Background
          border: "#1f1f1f",   // Subtle Border
          surface: "#141414",  // Card Surface

          // Accents
          primary: "#FF3333",  // Signal Red (Main Action/Critical)
          secondary: "#FF8800",// Alert Orange
          success: "#00CC66",  // System Healthy Green (Status only)
          warning: "#FFCC00",  // Warning Yellow
          danger: "#FF0000",   // Critical Failure
          muted: "#525252",    // Read-only text
          text: "#E5E5E5",     // Primary Text
        }
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(to right, #262626 1px, transparent 1px), linear-gradient(to bottom, #262626 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
export default config;
