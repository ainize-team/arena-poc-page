"use client";

import ChatBox from "@/components/chatBox";
import PromptInput from "@/components/promptInput";
import { Flex } from "antd";
import { useState } from "react";

export default function ArenaChat() {
  const [prompt, setPrompt] = useState('');

  return (
    <div>
      <Flex justify="space-between">
        <ChatBox modelName="Model A" prompt={prompt} />
        <ChatBox modelName="Model B" prompt={prompt} />
      </Flex>
      <PromptInput setParentPrompt={setPrompt} />
    </div>
  )
}
