import ArenaMenu from "@/components/arenaMenu";
import Mypage from "@/containers/mypage";
import { ArenaMenuKey } from "@/types/type";

export default function Home() {
  return (
    <main className="min-h-screen">
      <ArenaMenu page={ArenaMenuKey.MYPAGE} />
        <Mypage />
    </main>
  );
}
