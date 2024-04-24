"use client";

import ChatBox from "@/components/chatBox";
import PromptInput from "@/components/promptInput";
import { Button, Flex } from "antd";
import { useState } from "react";

type ArenaChatProps = {
  modelA: string,
  modelB: string,
}

enum ArenaStatus {
  READY = 'READY',
  COMPETING = 'COMPETING',
  END = 'END',
}

export default function ArenaChat({modelA, modelB}: ArenaChatProps) {
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<ArenaStatus>(ArenaStatus.READY)

  const onClickReadyBtn = (e: any) => {
    console.log('e.target.value :>> ', e.target.value);
    setStatus(ArenaStatus.END);
  }

  const handlePrompt = (prompt: string) => {
    setPrompt(prompt);
    setStatus(ArenaStatus.COMPETING);
  }

  return (
    <div>
      <Flex justify="space-between">
        <ChatBox modelName="Model A" prompt={prompt} />
        <ChatBox modelName="Model B" prompt={prompt} />
      </Flex>
      <Button onClick={onClickReadyBtn} value={'Model A'} disabled={status !== ArenaStatus.COMPETING}>Model A</Button>
      <Button onClick={onClickReadyBtn} value={'Model B'} disabled={status !== ArenaStatus.COMPETING}>Model B</Button>
      <Button onClick={onClickReadyBtn} value={'Tie'} disabled={status !== ArenaStatus.COMPETING}>Tie</Button>
      <Button onClick={onClickReadyBtn} value={'Nothing'} disabled={status !== ArenaStatus.COMPETING}>Nothing</Button>
      <PromptInput setParentPrompt={handlePrompt} />
      {status === ArenaStatus.END ? (<Button>NextChalenge</Button>) : (<></>) }
      
    </div>
  )
}
