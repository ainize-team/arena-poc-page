"use client";

import ArenaDescription from "@/src/components/arenaDescription";
import ArenaMenu from "@/src/components/arenaMenu";
import ArenaChat from "@/src/containers/arenaChat";
import { ArenaMenuKey } from "@/src/types/type";
import MaintenanceMsg from "@/src/components/maintenance";
import { Analytics } from "@vercel/analytics/react";
import { Manrope } from "next/font/google";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

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
