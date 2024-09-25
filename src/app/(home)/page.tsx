"use client";

import ArenaChat from "@/src/containers/arenaChat";
import MaintenanceMsg from "@/src/components/maintenance";
import { Analytics } from "@vercel/analytics/react";

export default function Home() {
  return (
    <main className="">
      {process.env.IS_ARENA_MAINTENANCE === "true" ? (
        <MaintenanceMsg />
      ) : (
        <ArenaChat />
      )}
      <Analytics />
    </main>
  );
}
