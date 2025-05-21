import { heroui } from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class",
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#217373",
          light: "#217373",
          dark: "#1E6565"
        },
        secondary: {
          DEFAULT: "#73BFB8",
          light: "#73BFB8",
          dark: "#5E9A96"
        },
        accent: {
          DEFAULT: "#F29E4C",
          light: "#F29E4C",
          dark: "#E59866"
        },
        background: {
          DEFAULT: "#F7FAFC",
          light: "#F7FAFC",
          dark: "#1A202C"
        },
        text: {
          DEFAULT: "#2D3748",
          light: "#2D3748",
          dark: "#E2E8F0"
        },
        complementary: "#6F2121",
        analogous: {
          green: "#219371",
          blue: "#213C73"
        }
      }, // ← don’t forget this comma
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  plugins: [heroui()],
}

module.exports = config
