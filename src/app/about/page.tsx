import ArenaMenu from "@/components/arenaMenu";
import About from "@/containers/about";
import { ArenaMenuKey } from "@/type";

export default function Home() {
  return (
    <main className="min-h-screen">
      <ArenaMenu page={ArenaMenuKey.ABOUT} />
      <About />
    </main>
  );
}
