import { getPickedModels } from "@/app/api/arena/chat/arena";
import ArenaChat from "./arenaChat";

export default async function ServerArena() {
  const modelNames = await getPickedModels();
  console.log(modelNames)
  return (
    <ArenaChat modelA={modelNames[0]} modelB={modelNames[1]} />
  )
}