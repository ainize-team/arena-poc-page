"use client";

import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { deleteCookie, getCookies, setCookie } from "cookies-next";
import Image from "next/image";

import { cn } from "@/src/utils/cn";
import UserMenu from "./userMenu";
import { themeAtom, userInfoState } from "../lib/recoil";

import ArenaLLMLogo from "@/public/images/logo/ArenaLLMLogo";

const Navbar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [theme, setTheme] = useRecoilState(themeAtom);
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);
  const [currentTheme, setCurrentTheme] = useState("light");

  useEffect(() => {
    checkTheme(theme);
  }, [theme]);

  const checkTheme = (theme: string) => {
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      setCurrentTheme(systemTheme);
    } else {
      setCurrentTheme(theme);
    }
  };

  useEffect(() => {
    if (!session) {
      setUserInfo(null);
      deleteCookie("access_token");
      return;
    }
    const { access_token, refresh_token } = getCookies();
    if (!refresh_token) {
      if (session?.refreshToken) {
        setCookie("refresh_token", session.refreshToken.token, {
          expires: new Date(session.refreshToken.expire),
        });
        setUserInfo(session);
      }
    }
    if (!access_token) {
      if (session?.accessToken) {
        setCookie("access_token", session.accessToken.token, {
          expires: new Date(session.accessToken.expire),
        });
        setUserInfo(session);
      }
    }
  }, [session]);

  return (
    <header
      className={cn(
        "fixed left-0 top-0 z-navbar w-full bg-light-b1 px-4 py-6 lg:px-10 lg:py-4 max-mobile:h-[87px] min-mobile:h-[72px] dark:bg-dark",
      )}
    >
      <div className="flex items-center justify-between self-stretch">
        <nav>
          <Link
            href="/"
            className="flex- row flex items-center gap-3 text-lg font-bold leading-120 text-dark-b1 dark:text-light-b4"
          >
            <ArenaLLMLogo
              strokeColor={currentTheme === "light" ? "#000" : "#fff"}
            />
            AI Network LLM Arena
          </Link>
        </nav>
        <div className="flex gap-6 max-desktop:hidden">
          <Link
            href="/"
            className={cn(
              "text-sm leading-120",
              pathname === "/"
                ? "font-bold text-light-t1 dark:text-light"
                : "font-medium text-dark-t2 dark:text-light-t2",
            )}
          >
            Arena
          </Link>
          <Link
            href="/leaderboard"
            className={cn(
              "text-sm leading-120",
              pathname === "/leaderboard"
                ? "font-bold text-light-t1 dark:text-light"
                : "font-medium text-dark-t2 dark:text-light-t2",
            )}
          >
            Leaderboard
          </Link>
          <Link
            href="/about"
            className={cn(
              "text-sm leading-120",
              pathname === "/about"
                ? "font-bold text-light-t1 dark:text-light"
                : "font-medium text-dark-t2 dark:text-light-t2",
            )}
          >
            About
          </Link>
        </div>
        <div className="flex h-10 items-center justify-end gap-2 min-mobile:w-52">
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
