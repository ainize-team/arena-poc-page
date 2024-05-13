"use client";

import ChatBox from "@/components/chatBox";
import PromptInput from "@/components/promptInput";
import { Button, Flex, notification } from "antd";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { chatResult, chatReward, chatWithModel } from "@/lib/chat";
import { ArenaStatus, ChoiceType } from "@/type";
import ChoiceButton from "@/components/choiceButton";

type ArenaChatProps = {
  modelA: string,
  modelB: string,
}

export default function ArenaChat({modelA, modelB}: ArenaChatProps) {
  const router = useRouter();

  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<ArenaStatus>(ArenaStatus.READY);
  const [modelAName, setModelAName] = useState('');
  const [modelBName, setModelBName] = useState('');
  const [resultA, setResultA] = useState('');
  const [resultB, setResultB] = useState('');
  const [api, contextHolder] = notification.useNotification();
  
  const openNotification = (rewardData: any) => {
    console.log(rewardData);
    api.info({
      message: `reward Success!`,
      description:`reward: ${rewardData.reward}AIN`,
      placement: "topRight",
    });
  };

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

  const onClickChoiceBtn = async (value: ChoiceType) => {
    setStatus(ArenaStatus.REGISTERING)
    try {
      const battleId = await chatResult({
        userAddress: '0x321a3A5FFBb094871310EcA1f3f436335081E0a6', // FIXME(yoojin): change after connecting wallet.
        choice: value,
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
      setStatus(ArenaStatus.END);
      const reward = chatReward(battleId)
      openNotification(await reward)
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
      setStatus(ArenaStatus.INFERENCING)
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
      {contextHolder}
      <Flex justify="space-between">
        <ChatBox modelName={modelAName} prompt={resultA} />
        <ChatBox modelName={modelBName} prompt={resultB} />
      </Flex>
      <ChoiceButton onClick={onClickChoiceBtn} value={ChoiceType.MODELA} arenaStatus={status} />
      <ChoiceButton onClick={onClickChoiceBtn} value={ChoiceType.MODELB} arenaStatus={status} />
      <ChoiceButton onClick={onClickChoiceBtn} value={ChoiceType.TIE} arenaStatus={status} />
      <ChoiceButton onClick={onClickChoiceBtn} value={ChoiceType.NOTHING} arenaStatus={status} />
      <PromptInput setParentPrompt={handlePrompt} status={status}/>
      {status === ArenaStatus.END ? (
        <Button onClick={onClickNextBtn}>NextChallenge</Button>
        ) : (<></>) }
      
    </div>
  )
}
