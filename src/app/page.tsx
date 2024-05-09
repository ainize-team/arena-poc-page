import Dashboard from "@/containers/dashboard";
import ServerArena from "@/containers/serverArena";

export default function Home() {
  return (
    <main className="min-h-screen justify-between p-24">
      <ServerArena />
      <Dashboard /> {/* FIXME(yoojin): add choice components */}
    </main>
  );
}
