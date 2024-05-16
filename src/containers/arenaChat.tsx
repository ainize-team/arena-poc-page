"use client";

import ChatBox from "@/components/chatBox";
import PromptInput from "@/components/promptInput";
import { Button, Col, Flex, Row, Space, notification } from "antd";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { chatResult, chatReward, chatWithModel } from "@/lib/arena";
import { ArenaStatus, ChoiceType } from "@/type";
import ChoiceButton from "@/components/choiceButton";
import { useRecoilState } from "recoil";
import { addressAtom } from "@/lib/wallet";

type ArenaChatProps = {
  modelA: string,
  modelB: string,
}

export default function ArenaChat({modelA, modelB}: ArenaChatProps) {
  const router = useRouter();

  const [prompt, setPrompt] = useState("");
  const [address, setAddress] = useRecoilState (addressAtom);
  const [status, setStatus] = useState<ArenaStatus>(ArenaStatus.NOTCONNECTED);
  const [modelAName, setModelAName] = useState("");
  const [modelBName, setModelBName] = useState("");
  const [resultA, setResultA] = useState("");
  const [resultB, setResultB] = useState("");
  const [notiApi, notiContextHolder] = notification.useNotification();
  
  const openNotification = (rewardData: any) => {
    console.log(rewardData);
    notiApi.info({
      message: "Reward Success!",
      description:`reward: ${rewardData.reward} AIN`,
      placement: "topRight",
    });
  };

  useEffect(() => {
    switch(status) {
      case ArenaStatus.NOTCONNECTED:
      case ArenaStatus.READY:
      case ArenaStatus.COMPETING: 
        setModelAName("modelA");
        setModelBName("modelB");
        break;
      case ArenaStatus.END:
        setModelAName(modelA);
        setModelBName(modelB);
    }
  }, [status])

  useEffect(()=> {
    if (address !== "") {
      setStatus(ArenaStatus.READY);
    } else {
      setStatus(ArenaStatus.NOTCONNECTED);
    }
  }, [address])

  const resetStates = () => {
    setPrompt("");
    setStatus(ArenaStatus.READY);
    setResultA("");
    setResultB("");
  }

  const onClickChoiceBtn = async (value: ChoiceType) => {
    setStatus(ArenaStatus.REGISTERING);
    try {
      const battleId = await chatResult({
        userAddress: address,
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
      const reward = chatReward(battleId);
      openNotification(await reward);
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
      setStatus(ArenaStatus.INFERENCING);
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
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      {notiContextHolder}
      <Flex justify="space-between">
        <ChatBox modelName={modelAName} status={status} prompt={resultA} />
        <ChatBox modelName={modelBName} status={status} prompt={resultB} />
      </Flex>
        <Row justify="space-evenly">
          <Col span={3} />
          <Col span={3}><ChoiceButton onClick={onClickChoiceBtn} value={ChoiceType.MODELA} arenaStatus={status} /></Col>
          <Col span={3}><ChoiceButton onClick={onClickChoiceBtn} value={ChoiceType.MODELB} arenaStatus={status} /></Col>
          <Col span={3}><ChoiceButton onClick={onClickChoiceBtn} value={ChoiceType.TIE} arenaStatus={status} /></Col>
          <Col span={3}><ChoiceButton onClick={onClickChoiceBtn} value={ChoiceType.NOTHING} arenaStatus={status} /></Col>
          <Col span={3} />
        </Row>
      <PromptInput setParentPrompt={handlePrompt} status={status}/>
      {status === ArenaStatus.END ? (
        <Button onClick={onClickNextBtn}>Next Challenge</Button>
        ) : (<></>) }
      <div />
    </Space>
  )
}
