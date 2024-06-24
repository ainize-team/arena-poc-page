import ArenaDescription from "@/components/arenaDescription";
import ArenaMenu from "@/components/arenaMenu";
import ArenaChat from "@/containers/arenaChat";
import { ArenaMenuKey } from "@/type";
import MaintenanceMsg from "@/components/maintenance";

export default function Home() {
return (
    <main className="min-h-screen">
      <ArenaMenu page={ArenaMenuKey.ARENA} />
      {process.env.IS_ARENA_MAINTENANCE === "true"? 
        <MaintenanceMsg/> :
        <>
          <ArenaDescription />
          <ArenaChat />
        </> 
      }
    </main>
  );
}
