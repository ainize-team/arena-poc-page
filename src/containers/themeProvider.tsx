"use client";

import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { themeAtom } from "../lib/recoil";
import { Toaster } from "sonner";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useRecoilState(themeAtom);

  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);

  const updateThemeColor = (theme: "light" | "dark") => {
    const themeColor = theme === "dark" ? "#000000" : "#f1f3f7";
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", themeColor);
    }
  };

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    if (theme !== "system") {
      document.documentElement.classList.add(theme);
      updateThemeColor(theme === "light" ? "light" : "dark");
    } else {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      document.documentElement.classList.add(systemTheme);
      updateThemeColor(systemTheme);
    }
  }, [theme]);

  return (
    <>
      {children}
      <Toaster
        position="top-right"
        richColors={true}
        closeButton={true}
        duration={3000}
        theme={
          theme === "light" ? "light" : theme === "system" ? "system" : "dark"
        }
      />
    </>
  );
}
