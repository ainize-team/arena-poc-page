/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        inter: ["var(--font-inter)"],
        manrope: ["var(--font-manrope)"],
      },
      fontSize: {
        "2xs": "0.625rem", // 10px,
        "2sm": "0.8125rem", // 13px
        "0.5sm": "0.9375rem", // 15px
        md: "1.0625rem", // 17px
        "2.5xl": "1.75rem", // 28px
        "3.5xl": "2rem", // 32px,
        "4.5xl": "2.625rem", // 42px
      },
      lineHeight: {
        120: "1.2",
        130: "1.3",
        135: "1.35",
        140: "1.4",
        145: "1.45",
        150: "1.5",
        160: "1.6",
        170: "1.7",
        175: "1.75",
      },
      zIndex: {
        loading: "60",
        layout: "70",
        sidebar: "80",
        popover: "98",
        modal: "99",
        over: "9999",
      },
      maxWidth: {
        960: "960px",
      },
      screens: {
        xsm: "460px",
        "max-lg": { max: "1023px" },
        "max-desktop": { max: "959px" },
      },
    },
    colors: {
      current: "currentColor",
      transparent: "transparent",
      primary: {
        DEFAULT: "#ae8afb",
        light: "#F0EAFF",
        lightHover: "#DFD1FA",
        lightActive: "#CBB9F4",
        violet1: "#ae8afb",
        violet1Hover: "#9E73F8",
        violet1Active: "#8A54FF",
        violet2: "#6722ff",
        violet2Hover: "#5d1fe6",
        violet2Active: "#521bcc",
      },
      light: {
        DEFAULT: "#ffffff",
        icon: "#62667d",
        t1: "#000000",
        t2: "#72778f",
        t3: "#adb2ca",
        l1: "#c9cfde",
        l2: "#e6eaf4",
        b1: "#f1f3f8",
        b2: "#f6f7fa",
        b3: "#fbfbfc",
        b4: "#FFFFFF",
      },
      dark: {
        DEFAULT: "#000000",
        icon: "#9EA0B7",
        t1: "#FFFFFF",
        t2: "#8D93A5",
        t3: "#62667D",
        l1: "#5C5E77",
        l2: "#53556B",
        b1: "#000000",
        b2: "#1B1D22",
        b3: "#292A33",
        b4: "#343541",
      },
      orange: {
        DEFAULT: "#FF823C",
        t1: "#FFB700",
        t2: "#FF7A00",
        light: {
          t1Bg: "#FFF6DF",
          t2Bg: "#FFF2E5",
        },
        dark: {
          t1Bg: "#4C4333",
          t2Bg: "#543a29",
        },
      },
      blue: {
        DEFAULT: "#4B88FF",
        25: "#A6ADF3",
        50: "#3647E5",
        75: "#0F1974",
      },
    },
  },
  plugins: [],
};
