import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#ffffff", // Pure White
        foreground: "#0f172a", // Deep Slate
        accent: "#2563eb", // Vibrant Blue
        accent2: "#10b981", // Success Green
        card: "#f8fafc", // Soft Gray for cards
        border: "#e2e8f0", // Subtle border
        muted: "#64748b",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        '3xl': '18px',
      }
    },
  },
  plugins: [],
};
export default config;
