import { getPickedModels } from "@/app/api/chat";
import ArenaChat from "./arenaChat";

export default async function ServerArena() {
  const modelNames = await getPickedModels();

  return (
    <ArenaChat modelA={modelNames[0]} modelB={modelNames[1]} />
  )
}