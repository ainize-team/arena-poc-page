"use client";

import ArenaMenu from "@/src/components/arenaMenu";
import MaintenanceMsg from "@/src/components/maintenance";
import Leaderboard from "@/src/containers/leaderboard";
import { ArenaMenuKey } from "@/src/types/type";

export default function Home() {
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
