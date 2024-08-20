"use client";

import ArenaMenu from "@/components/arenaMenu";
import MaintenanceMsg from "@/components/maintenance";
import Leaderboard from "@/containers/leaderboard";
import { ArenaMenuKey } from "@/types/type";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.body.style.setProperty("--bg-color", "#ffffff");
    return () => {
      document.body.style.setProperty("--bg-color", "");
    };
  }, []);

  return (
    <main className="min-h-screen">
      <ArenaMenu page={ArenaMenuKey.LEADERBOARD} />
      {process.env.IS_LEADERBOARD_MAINTENANCE === "true" ? (
        <MaintenanceMsg />
      ) : (
        <Leaderboard />
      )}
    </main>
  );
}
