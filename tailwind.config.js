import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/app/**/*.{html,js,ts,jsx,tsx}",
  "./src/components/**/*.{html,js,ts,jsx,tsx}",
  "./src/containers/**/*.{html,js,ts,jsx,tsx}",
];
export const darkMode = "selector";
export const variants = {
  extend: {
    stroke: ["hover", "group-hover"],
  },
};
export const theme = {
  extend: {
    textShadow: {
      DEFAULT: "0.699px 2.794px 5.589px rgba(0, 0, 0, 0.45)",
    },
    backgroundImage: {
      "burning-fire": "url('../assets/images/banner.svg')",
      "burning-fire-mobile": "url('../assets/images/bannerMobile.svg')",
    },
    keyframes: {
      "slide-in": {
        "0%": { transform: "translateX(70%)", opacity: 0 },
        "100%": { transform: "translateX(0)", opacity: 1 },
      },
      "slide-out": {
        "0%": { transform: "translateX(0)", opacity: 1 },
        "100%": { transform: "translateX(70%)", opacity: 0 },
      },
    },
    animation: {
      "slide-in": "slide-in 0.3s ease-out forwards",
      "slide-out": "slide-out 0.3s ease-in forwards",
    },
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
      navbar: "999",
      over: "9999",
    },
    maxWidth: {
      960: "960px",
    },
    screens: {
      xsm: "460px",
      "max-lg": { max: "1023px" },
      "max-desktop": { max: "959px" },
      "min-desktop": { min: "960px" },
      "max-mobile": { max: "699px" },
      "min-mobile": { min: "700px" },
    },
    boxShadow: {
      avatar: "0 0 0 2px rgba(0,0,0, 0.15) inset",
      popover: "0px 4px 12px 0px rgba(0,0,0, 0.15)",
      "popover-dark": "0px 4px 12px 0px rgba(255,255,255, 0.3)",
      hover: "0px 2px 4px 0px rgba(165, 163, 174, 0.30)",
      "hover-dark": "0px 2px 4px 0px rgba(0, 0, 0, 0.30)",
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
      violet1Active: "#8A54FD",
      violet2: "#6722ff",
      violet2Hover: "#5d1fe6",
      violet2Active: "#521bcc",
      violet3: "#A277FF",
    },
    light: {
      DEFAULT: "#ffffff",
      icon: "#62667d",
      t1: "#000000",
      t2: "#73778F",
      t3: "#adb2ca",
      l1: "#c9cfde",
      l2: "#e6eaf4",
      b1: "#f1f3f8",
      b2: "#f6f7fa",
      b3: "#fbfbfc",
      b4: "#FFFFFF",
      tier0Text: "#8D93A5",
      tier0Bg: "#E6E8ED",
      tier1Text: "#FFAA00",
      tier1Bg: "#FFF6DF",
      tier2Text: "#FF7A00",
      tier2Bg: "#FFF2E5",
      tier3Text: "#FF5C00",
      tier3Bg: "#FFEFE6",
      tier4Text: "#FF0000",
      tier4Bg: "#FFE5E5",
      tier5Text: "#8F14A3",
      tier5Bg: "#EEDCF1",
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
      tier0DarkText: "#C9CFDE",
      tier0DarkBg: "#595B66",
      tier1DarkText: "#FFAA00",
      tier1DarkBg: "#4C4333",
      tier2DarkText: "#FF7A00",
      tier2DarkBg: "#543A29",
      tier3DarkText: "#FF5C00",
      tier3DarkBg: "#451D07",
      tier4DarkText: "#FF0000",
      tier4DarkBg: "#380909",
      tier5DarkText: "#A801C3",
      tier5DarkBg: "#25092A",
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
    green: {
      DEFAULT: "#009785",
      light: {
        DEFAULT: "#009785",
        t1: "#00D4A0",
        t2: "#B3F1E2",
        t3: "#D9F8F0",
      },
      dark: {
        DEFAULT: "#00D4A0",
        t1: "#009785",
        t2: "#2A5554",
        t3: "#387372",
      },
    },
  },
};
export const plugins = [
  plugin(function ({ matchUtilities, theme }) {
    matchUtilities(
      {
        "text-shadow": (value) => ({
          textShadow: value,
        }),
      },
      { values: theme("textShadow") },
    );
  }),
  // require("@tailwindcss/forms"),
];
