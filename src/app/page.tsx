import ArenaMenu from "@/components/arenaMenu";
import ServerArena from "@/containers/serverArena";
import { ArenaMenuKey } from "@/type";

export default function Home() {
return (
    <main className="min-h-screen">
      <ArenaMenu page={ArenaMenuKey.ARENA} />
      <ServerArena />
    </main>
  );
}
