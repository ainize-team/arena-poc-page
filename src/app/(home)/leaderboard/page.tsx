import ArenaMenu from "@/components/arenaMenu";
import MaintenanceMsg from "@/components/maintenance";
import Leaderboard from "@/containers/leaderboard";
import { ArenaMenuKey } from "@/types/type";

export default function Home() {
  return (
    <main className="min-h-screen">
      <ArenaMenu page={ArenaMenuKey.LEADERBOARD} />
        {
          process.env.IS_LEADERBOARD_MAINTENANCE === "true" ? 
            <MaintenanceMsg /> :
            <Leaderboard />
        }
    </main>
  );
}
