import ArenaMenu from "@/components/arenaMenu";
import ServerArena from "@/containers/serverArena";
import { ArenaMenuKeys } from "@/type";

export default function Home() {
return (
    <main className="min-h-screen">
      <ArenaMenu page={ArenaMenuKeys.BATTLE} />
      <ServerArena />
    </main>
  );
}
