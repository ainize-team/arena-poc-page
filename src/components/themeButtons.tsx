"use client";

import Image from "next/image";
import { useRecoilState } from "recoil";
import { themeAtom } from "../lib/recoil";
import { cn } from "../utils/cn";

import ArrowLeftBlack from "@/public/images/buttons/ArrowLeftBlack.svg";
import CheckBlack from "@/public/images/buttons/CheckBlack.svg";

type ThemeButtonsProps = {
  className?: string;
  handleAnimationEnd: () => void;
  handleClose: () => void;
};

export default function ThemeButtons({
  className,
  handleAnimationEnd,
  handleClose,
}: ThemeButtonsProps) {
  const [theme, setTheme] = useRecoilState(themeAtom);

  const themes = ["light", "dark", "system"];

  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(systemTheme);
    } else {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(newTheme);
    }
  };

  return (
    <div className={cn(className)} onAnimationEnd={handleAnimationEnd}>
      <div className="flex h-[5.5rem] flex-row items-center justify-start gap-4 self-stretch border-b border-light-b1 px-4 py-6">
        <Image
          alt="arrow left black"
          width={24}
          height={24}
          src={ArrowLeftBlack}
          className="cursor-pointer border"
          onClick={handleClose}
        />
        <h1 className="text-xl font-semibold leading-120 text-dark">Theme</h1>
      </div>
      <div className="flex flex-col items-start self-stretch py-4">
        {themes.map((selectedTheme) => (
          <div
            className="flex flex-row items-center justify-start gap-[10px] self-stretch p-4"
            key={"theme_" + selectedTheme}
          >
            <div className="h-6 w-6">
              {theme === selectedTheme ? (
                <Image
                  alt="check button black"
                  width={24}
                  height={24}
                  src={CheckBlack}
                />
              ) : (
                <></>
              )}
            </div>
            <button
              onClick={() => changeTheme(selectedTheme)}
              className="text-base font-medium leading-150 text-dark"
            >
              {selectedTheme === "light"
                ? "Light Mode"
                : selectedTheme === "dark"
                  ? "Dark Mode"
                  : "Based on system settings"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
