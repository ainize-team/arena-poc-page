"use client";

import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { getCookies, setCookie } from "cookies-next";

import { cn } from "@/src/utils/cn";
import { isDarkMode } from "@/src/utils/checkUserStates";
import UserMenu from "./userMenu";
import { userInfoState } from "../lib/recoil";

const Navbar = () => {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);
  const { data: session } = useSession();
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);

  useEffect(() => {
    const { access_token, refresh_token } = getCookies();
    if (!refresh_token) {
      if (session?.refreshToken) {
        setCookie("refresh_token", session.refreshToken.token, {
          expires: new Date(session.refreshToken.expire),
        });
      }
    }
    if (!access_token) {
      if (session?.accessToken) {
        setCookie("access_token", session.accessToken.token, {
          expires: new Date(session.accessToken.expire),
        });
      }
    }
    setUserInfo(session);
    console.log("session : ", session);
  }, [session]);

  useEffect(() => {
    if (isDarkMode()) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkMode(!darkMode);
  };

  return (
    <header className="px-4 py-6 lg:px-10 lg:py-4">
      <div className="container flex items-center justify-between">
        <nav>
          <Link
            href="/"
            className="text-lg font-bold leading-120 text-dark-b1 dark:text-light-b4"
          >
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
            href="/mypage"
            className={cn(
              "text-sm leading-120",
              pathname === "/mypage"
                ? "font-bold text-light-t1 dark:text-light"
                : "font-medium text-dark-t2 dark:text-light-t2",
            )}
          >
            About
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="text-dark dark:text-light"
          >
            {darkMode ? "light(임시)" : "dark(임시)"}
          </button>
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
