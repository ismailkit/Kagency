/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'sans': ["League Spartan", 'sans-serif'],
      'display': ["Prequel", 'sans-serif'],

    },
    fontMetrics: {
      "League Spartan": {
        capHeight: 48,
        lineGap: 24,
      },
      "Prequel": {
        capHeight: 48,
        lineGap: 24,
      },
    },
    extend: {
      "colors": {
        "red": {
          50: "#FDE7E8",
          100: "#FBD0D0",
          200: "#F8A5A7",
          300: "#F47678",
          400: "#F14C4E",
          500: "#ED1D22",
          600: "#C61013",
          700: "#920C0E",
          800: "#630809",
          900: "#2F0404",
          950: "#180202"
        },
        "black": {
          50: "#E8E8E8",
          100: "#D4D4D4",
          200: "#A8A8A8",
          300: "#7A7A7A",
          400: "#4F4F4F",
          500: "#242424",
          600: "#1C1C1C",
          700: "#141414",
          800: "#0F0F0F",
          900: "#080808",
          950: "#000000"
        }
      },
    },
  },
  plugins: [],
}

