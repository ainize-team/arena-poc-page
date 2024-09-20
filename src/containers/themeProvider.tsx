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

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    if (theme !== "system") {
      document.documentElement.classList.add(theme);
    } else {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      document.documentElement.classList.add(systemTheme);
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
