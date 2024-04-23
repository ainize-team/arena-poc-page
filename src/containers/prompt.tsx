"use client";

import ChatBox from "@/components/chatBox";
import PromptInsert from "@/components/promptInsert";
import { useState } from "react";

export default function Prompt() {
  const [prompt, setPrompt] = useState();

  return (
    <div>
      <div className="flex flex-row">
        <ChatBox modelName="Model A" prompt={prompt} />
        <ChatBox modelName="Model B" prompt={prompt} />
      </div>
      <PromptInsert setParentPrompt={setPrompt} />
    </div>
  )
}