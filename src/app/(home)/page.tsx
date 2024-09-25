"use client";

import ArenaChat from "@/src/containers/arenaChat";
import MaintenanceMsg from "@/src/components/maintenance";
import { Analytics } from "@vercel/analytics/react";
import Meta from "@/src/components/meta";
import { getCurrentURL } from "@/src/constant/constant";

export default function Home() {
  return (
    <>
      <Meta description="AI Network LLM Arena" url={`${getCurrentURL()}`} />
      <main className="">
        {process.env.IS_ARENA_MAINTENANCE === "true" ? (
          <MaintenanceMsg />
        ) : (
          <ArenaChat />
        )}
        <Analytics />
      </main>
    </>
  );
}
