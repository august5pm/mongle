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
        // 제목은 Pretendard로 단단하게, Dongle은 로고 워드마크(font-brand)에만
        display: ["var(--font-ko)", "Pretendard", "var(--font-sans)", "sans-serif"],
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
          "2.75rem",
          { lineHeight: "1.12", fontWeight: "800", letterSpacing: "-0.03em" },
        ],
        "display-lg-mobile": [
          "1.875rem",
          { lineHeight: "1.18", fontWeight: "800", letterSpacing: "-0.025em" },
        ],
        "headline-md": [
          "1.375rem",
          { lineHeight: "1.3", fontWeight: "700", letterSpacing: "-0.02em" },
        ],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-sm": [
          "12px",
          { lineHeight: "16px", fontWeight: "600", letterSpacing: "0.04em" },
        ],
      },
      // Tailwind 기본 스케일(sm 2px … 2xl 16px)을 쓰고, 카드용 3xl만 20px로 낮춘다
      borderRadius: {
        "3xl": "1.25rem",
      },
      spacing: {
        "container-mobile": "20px",
        "container-desktop": "40px",
      },
      // 모션 토큰 — globals.css의 --ease-* / --dur-* 와 같은 값
      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0.2, 0, 0, 1)",
        standard: "cubic-bezier(0.2, 0, 0, 1)",
        emphasized: "cubic-bezier(0.05, 0.7, 0.1, 1)",
      },
      transitionDuration: {
        DEFAULT: "200ms",
        fast: "150ms",
        base: "240ms",
        slow: "400ms",
      },
      animation: {
        "fade-in": "fadeIn 600ms cubic-bezier(0.2, 0, 0, 1) both",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
