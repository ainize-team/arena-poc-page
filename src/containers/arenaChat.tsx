"use client";

import ChatBox from "@/components/chatBox";
import PromptInput from "@/components/promptInput";
import { Button, Flex } from "antd";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { chatResult, chatReward, chatWithModel } from "@/lib/chat";

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
  const router = useRouter();

  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<ArenaStatus>(ArenaStatus.READY);
  const [modelAName, setModelAName] = useState('');
  const [modelBName, setModelBName] = useState('');
  const [resultA, setResultA] = useState('');
  const [resultB, setResultB] = useState('');

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

  const resetStates = () => {
    setPrompt('');
    setStatus(ArenaStatus.READY);
    setResultA('');
    setResultB('');
  }

  const onClickResultBtn = async (e: any) => {
    const value = e.target.value; //FIXME(yoojin): undefined
    try {
      const battleId = await chatResult({
        userAddress: '0x321a3A5FFBb094871310EcA1f3f436335081E0a6', // FIXME(yoojin): change after connecting wallet.
        choice: !value ? "model_a" : value,
        modelA: modelA,
        modelB: modelB,
        turn: 1,
        modelAResponse: [{
          role: "user",
          content: prompt,
        }, {
          role: "assistant",
          content: resultA
        }],
        modelBResponse: [{
          role: "user",
          content: prompt,
        }, {
          role: "assistant",
          content: resultB,
        }]
      })
      const reward = await chatReward(battleId);
      console.log('reward :>> ', reward); // FIXME(yoojin): display this data
      setStatus(ArenaStatus.END);
    } catch (err) {
      alert(`${err}.\n If the error is repeated, please refresh the page.`);
    }
  }

  const onClickNextBtn = () => {
    resetStates();
    router.refresh();
  }

  const handlePrompt = async (prompt: string) => {
    if (status === ArenaStatus.READY) {
      setPrompt(prompt);
      try {
        setResultA(await chatWithModel(modelA, prompt));
        setResultB(await chatWithModel(modelB, prompt));
        
        setStatus(ArenaStatus.COMPETING);
      } catch (err) {
        alert(err);
        resetStates();
        router.refresh();
      }
    }
  }

  return (
    <div>
      <Flex justify="space-between">
        <ChatBox modelName={modelAName} prompt={resultA} />
        <ChatBox modelName={modelBName} prompt={resultB} />
      </Flex>
      <Button onClick={onClickResultBtn} value={'model_a'} disabled={status !== ArenaStatus.COMPETING}>Model A</Button>
      <Button onClick={onClickResultBtn} value={'model_b'} disabled={status !== ArenaStatus.COMPETING}>Model B</Button>
      <Button onClick={onClickResultBtn} value={'tie'} disabled={status !== ArenaStatus.COMPETING}>Tie</Button>
      <Button onClick={onClickResultBtn} value={'bad'} disabled={status !== ArenaStatus.COMPETING}>Nothing</Button>
      <PromptInput setParentPrompt={handlePrompt}/>
      {status === ArenaStatus.END ? (
        <Button onClick={onClickNextBtn}>NextChallenge</Button>
        ) : (<></>) }
      
    </div>
  )
}
