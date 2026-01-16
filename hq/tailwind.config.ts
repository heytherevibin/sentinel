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
        // Professional "Void" Palette
        c2: {
          bg: "#050505",       // Absolute Zero
          paper: "#0A0A0A",    // Secondary Background
          border: "#262626",   // Subtle Borders
          surface: "#111111",  // Component Backgrounds

          // Accents
          primary: "#00E5FF",  // Cyan (Info/Active)
          success: "#00CC66",  // Green (Stable)
          warning: "#FFB020",  // Amber (Risk)
          danger: "#FF3333",   // Red (Block/Critical)
          muted: "#525252",    // Text secondary
          text: "#E5E5E5",     // Text primary
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
