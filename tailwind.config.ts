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
        background: "#050607",
        primary: "#ffe8e2",
        "on-primary": "#3a2420",
        "primary-container": "#ffc4b8",
        "on-primary-container": "#5c3830",
        secondary: "#c9d8ff",
        "on-secondary": "#1a2740",
        "secondary-container": "#3a4a6b",
        "on-secondary-container": "#dce6ff",
        "secondary-fixed": "#e8efff",
        tertiary: "#e8e4ff",
        "on-tertiary": "#2a2848",
        "tertiary-container": "#c8c4f5",
        "on-tertiary-container": "#42406a",
        error: "#ffb4ab",
        "error-container": "#93000a",
        "on-surface": "#f2f4f6",
        "on-surface-variant": "#a8b4c0",
        outline: "#7a8694",
        pearl: {
          DEFAULT: "#f7f9fc",
          soft: "rgba(232, 240, 255, 0.16)",
          mist: "rgba(255, 252, 248, 0.55)",
        },
        surface: {
          DEFAULT: "#050607",
          dim: "#050607",
          bright: "#2a3038",
          "container-lowest": "#030405",
          "container-low": "#0e1114",
          container: "#14181c",
          "container-high": "#1e242a",
          "container-highest": "#2a323a",
          tint: "#ffc4b8",
        },
        ink: {
          DEFAULT: "#f2f4f6",
          soft: "#a8b4c0",
          mute: "rgba(242, 244, 246, 0.45)",
        },
        blush: {
          DEFAULT: "#ffc4b8",
          soft: "rgba(255, 196, 184, 0.18)",
        },
        stage: {
          DEFAULT: "#050607",
          raised: "#14181c",
        },
        fog: {
          DEFAULT: "rgba(255, 255, 255, 0.1)",
          dim: "rgba(255, 255, 255, 0.05)",
        },
      },
      fontFamily: {
        serif: ["var(--font-display)", "Dongle", "sans-serif"],
        display: ["var(--font-display)", "Dongle", "sans-serif"],
        sans: [
          "var(--font-sans)",
          "var(--font-ko)",
          "Nunito",
          "Pretendard",
          "sans-serif",
        ],
        brand: ["var(--font-display)", "Dongle", "sans-serif"],
      },
      fontSize: {
        "display-lg": [
          "3.25rem",
          { lineHeight: "1.15", fontWeight: "700", letterSpacing: "-0.01em" },
        ],
        "display-lg-mobile": [
          "2.25rem",
          { lineHeight: "1.2", fontWeight: "700" },
        ],
        "headline-md": ["1.75rem", { lineHeight: "1.3", fontWeight: "700" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-sm": [
          "12px",
          { lineHeight: "16px", fontWeight: "600", letterSpacing: "0.04em" },
        ],
      },
      borderRadius: {
        DEFAULT: "1rem",
        sm: "0.5rem",
        md: "1.5rem",
        lg: "2rem",
        xl: "3rem",
        mongle: "2rem",
        cloud: "1.5rem",
      },
      spacing: {
        "container-mobile": "20px",
        "container-desktop": "40px",
      },
      backgroundImage: {
        "mongle-gradient":
          "linear-gradient(120deg, #fff8f5, #ffc8bc 50%, #c9d8ff)",
        "pearl-shine":
          "linear-gradient(160deg, rgba(255,255,255,0.7), rgba(232,240,255,0.45) 45%, rgba(255,236,230,0.4))",
        "hero-glow":
          "radial-gradient(ellipse 75% 60% at 78% 32%, rgba(255, 220, 210, 0.18), transparent 58%), radial-gradient(ellipse 50% 45% at 18% 80%, rgba(170, 200, 255, 0.14), transparent 55%)",
        scrim:
          "linear-gradient(to top, rgba(5,6,7,1) 0%, rgba(5,6,7,0.55) 45%, transparent 80%)",
        "scrim-side":
          "linear-gradient(to right, rgba(5,6,7,0.7) 0%, transparent 55%)",
      },
      boxShadow: {
        "peach-glow":
          "0 0 24px rgba(255, 200, 190, 0.28), inset 0 1px 0 rgba(255,255,255,0.5)",
        "nav-glow": "0 0 20px rgba(200, 220, 255, 0.22)",
        lift: "0 26px 60px rgba(0, 0, 0, 0.5)",
        poster:
          "0 18px 48px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.12)",
        soft: "0 10px 36px rgba(140, 170, 210, 0.12)",
        pearl:
          "inset 0 1.5px 1px rgba(255,255,255,0.8), inset 0 -8px 16px rgba(140,165,200,0.16), 0 12px 32px rgba(0,0,0,0.35)",
      },
      animation: {
        "fade-up": "fadeUp 0.75s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fadeIn 1s ease-out both",
        "rail-in": "fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        float: "float 7s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
