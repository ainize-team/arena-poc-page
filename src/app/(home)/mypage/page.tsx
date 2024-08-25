"use client";

import { useEffect } from "react";
import ArenaMenu from "@/src/components/arenaMenu";
import Mypage from "@/src/containers/mypage";
import { ArenaMenuKey } from "@/src/types/type";
import { isDarkMode } from "@/src/utils/checkUserStates";

export default function Home() {
  useEffect(() => {
    if (isDarkMode()) return;
    document.body.style.setProperty("--bg-color", "#ffffff");
    return () => {
      document.body.style.setProperty("--bg-color", "");
    };
  }, []);

  return (
    <main className="min-h-screen">
      <ArenaMenu page={ArenaMenuKey.MYPAGE} />
      <Mypage />
    </main>
  );
}