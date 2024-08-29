"use client";

import { useEffect } from "react";
import { useRecoilState } from "recoil";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { getCookies, setCookie } from "cookies-next";

import { cn } from "@/src/utils/cn";
import UserMenu from "./userMenu";
import { userInfoState } from "../lib/recoil";

const Navbar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);

  useEffect(() => {
    if (!session) return;
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

  return (
    //87 , 72
    <header
      className={cn(
        "min-mobile:h-[72px] max-mobile:h-[87px] fixed left-0 top-0 z-over w-full bg-light-b1 px-4 py-6 dark:bg-dark lg:px-10 lg:py-4",
      )}
    >
      <div className="flex items-center justify-between self-stretch">
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
        <div className="min-mobile:w-52 flex h-10 items-center justify-end gap-2">
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
