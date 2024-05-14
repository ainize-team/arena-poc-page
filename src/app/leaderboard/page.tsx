import ArenaMenu from "@/components/arenaMenu";
import Dashboard from "@/containers/leaderboard";
import { ArenaMenuKey } from "@/type";

export default function Home() {
  return (
    <main className="min-h-screen">
      <ArenaMenu page={ArenaMenuKey.LEADERBOARD} />
      <Dashboard />
    </main>
  );
}
