import ArenaMenu from "@/components/arenaMenu";
import Dashboard from "@/containers/dashboard";
import { ArenaMenuKeys } from "@/type";

export default function Home() {
  return (
    <main className="min-h-screen">
      <ArenaMenu page={ArenaMenuKeys.DASHBOARD} />
      <Dashboard />
    </main>
  );
}
