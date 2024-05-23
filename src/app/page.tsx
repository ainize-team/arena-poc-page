import ArenaMenu from "@/components/arenaMenu";
import ArenaChat from "@/containers/arenaChat";
import { ArenaMenuKey } from "@/type";

export default function Home() {
return (
    <main className="min-h-screen">
      <ArenaMenu page={ArenaMenuKey.ARENA} />
      <ArenaChat />
    </main>
  );
}
