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
        },
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
          },
          chart: {
            1: "#000000",
            2: "#262626",
            3: "#404040",
            4: "#737373",
            5: "#a3a3a3",
          },
          border: 'hsl(var(--border))',
          input: 'hsl(var(--input))',
          ring: 'hsl(var(--ring))',
        }, // 
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      }, // ← don’t forget this comma
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [heroui()],
}

module.exports = config
