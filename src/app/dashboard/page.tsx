import ArenaMenu from "@/components/arenaMenu";
import Dashboard from "@/containers/dashboard";

export default function Home() {
  const items = [{
    key: "battle",
    label: "Battle",
  }, {
    key: "dashboard",
    label: "Dashboard",
  }]

  return (
    <main className="min-h-screen">
      <ArenaMenu page='dashboard' />
      <Dashboard /> {/* FIXME(yoojin): add choice components */}
    </main>
  );
}
