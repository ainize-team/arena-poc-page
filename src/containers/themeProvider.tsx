"use client";

import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { themeAtom } from "../lib/recoil";

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
      // TODO(yunsubae) : 시스템 테마 다크모드일 땐 당분간 라이트로만 보여주기
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? // ? "dark"
          "light"
        : "light";
      document.documentElement.classList.add(systemTheme);
    }
  }, [theme]);

  return <>{children}</>;
}
