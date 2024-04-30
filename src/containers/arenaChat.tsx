"use client";

import ChatBox from "@/components/chatBox";
import PromptInput from "@/components/promptInput";
import { Button, Flex } from "antd";
import { useState, useEffect } from "react";

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
  const [status, setStatus] = useState<ArenaStatus>(ArenaStatus.READY);
  const [modelAName, setModelAName] = useState('');
  const [modelBName, setModelBName] = useState('');

  useEffect(() => {
    switch(status) {
      case ArenaStatus.READY:
      case ArenaStatus.COMPETING: 
        setModelAName('modelA');
        setModelBName('modelB');
        break;
      case ArenaStatus.END:
        setModelAName(modelA);
        setModelBName(modelB);
    }
  }, [status])

  const onClickResultBtn = (e: any) => {
    setStatus(ArenaStatus.END);
  }

  const handlePrompt = (prompt: string) => {
    setPrompt(prompt);
    setStatus(ArenaStatus.COMPETING);
  }

  return (
    <div>
      <Flex justify="space-between">
        <ChatBox modelName={modelAName} prompt={prompt} />
        <ChatBox modelName={modelBName} prompt={prompt} />
      </Flex>
      <Button onClick={onClickResultBtn} value={'Model A'} disabled={status !== ArenaStatus.COMPETING}>Model A</Button>
      <Button onClick={onClickResultBtn} value={'Model B'} disabled={status !== ArenaStatus.COMPETING}>Model B</Button>
      <Button onClick={onClickResultBtn} value={'Tie'} disabled={status !== ArenaStatus.COMPETING}>Tie</Button>
      <Button onClick={onClickResultBtn} value={'Nothing'} disabled={status !== ArenaStatus.COMPETING}>Nothing</Button>
      <PromptInput setParentPrompt={handlePrompt} />
      {status === ArenaStatus.END ? (<Button>NextChalenge</Button>) : (<></>) }
      
    </div>
  )
}
