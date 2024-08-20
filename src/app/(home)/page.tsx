"use client";

import ArenaDescription from "@/components/arenaDescription";
import ArenaMenu from "@/components/arenaMenu";
import ArenaChat from "@/containers/arenaChat";
import { ArenaMenuKey } from "@/types/type";
import MaintenanceMsg from "@/components/maintenance";
import { Analytics } from "@vercel/analytics/react";
import { Manrope } from "next/font/google";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export default function Home() {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-manrope: ${manrope.style.fontFamily};
          }
        `}
      </style>
      <main className="min-h-screen">
        <ArenaMenu page={ArenaMenuKey.ARENA} />
        {process.env.IS_ARENA_MAINTENANCE === "true" ? (
          <MaintenanceMsg />
        ) : (
          <>
            <ArenaDescription />
            <ArenaChat />
          </>
        )}
        <Analytics />
      </main>
    </>
  );
}
