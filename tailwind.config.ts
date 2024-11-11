import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#FAFAF8",
        foreground: "#141413",
        primary: {
          DEFAULT: "#8989DE",
          foreground: "#FAFAF8",
        },
        secondary: {
          DEFAULT: "#E6E4DD",
          foreground: "#141413",
        },
        success: {
          DEFAULT: "#7EBF8E",
          foreground: "#FAFAF8",
        },
        warning: {
          DEFAULT: "#D2886F",
          foreground: "#FAFAF8",
        },
        muted: {
          DEFAULT: "#C4C3BB",
          foreground: "#3A3935",
        },
        accent: {
          DEFAULT: "#8989DE",
          foreground: "#FAFAF8",
        },
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;