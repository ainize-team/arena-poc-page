import ArenaMenu from "@/components/arenaMenu";
import ServerArena from "@/containers/serverArena";
import { Menu } from 'antd';


export default function Home() {
return (
    <main className="min-h-screen">
      <ArenaMenu page="battle" />
      <ServerArena />
    </main>
  );
}
