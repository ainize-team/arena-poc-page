"use client";

import ChatBox from "@/components/chatBox";
import PromptInput from "@/components/promptInput";
import { Alert, Button, Flex, message, notification } from "antd";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { chatResult, chatReward, chatWithModel } from "@/lib/chat";
import { ArenaStatus } from "@/type";
import { requestAddress } from "@/lib/wallet";
import { WalletOutlined } from "@ant-design/icons";

type ArenaChatProps = {
  modelA: string,
  modelB: string,
}

export default function ArenaChat({modelA, modelB}: ArenaChatProps) {
  const router = useRouter();

  const [prompt, setPrompt] = useState('');
  const [address, setAddress] = useState<string>("");
  const [status, setStatus] = useState<ArenaStatus>(ArenaStatus.NOTCONNECTED);
  const [modelAName, setModelAName] = useState('');
  const [modelBName, setModelBName] = useState('');
  const [resultA, setResultA] = useState('');
  const [resultB, setResultB] = useState('');
  const [notiApi, notiContextHolder] = notification.useNotification();
  const [msgApi, msgContextHolder] = message.useMessage();
  
  const openNotification = (rewardData: any) => {
    console.log(rewardData);
    notiApi.info({
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

  useEffect(()=> {
    if(address !== ""){
      setStatus(ArenaStatus.READY)
    }
  },[address])

  const resetStates = () => {
    setPrompt('');
    setStatus(ArenaStatus.READY);
    setResultA('');
    setResultB('');
  }

  const onClickConnectWalletBtn = async (e: any) => {
    if(address != "") {
      return
    }
    const getAddress = await requestAddress();
    if(getAddress == undefined){
        msgApi.open({
          type: 'error',
          content: 'Cannot found AIN wallet.',
        });
      return
    }
    setAddress(getAddress)
  }

  const onClickResultBtn = async (e: any) => {
    const value = e.target.value; //FIXME(yoojin): undefined
    setStatus(ArenaStatus.REGISTERING)
    try {
      const battleId = await chatResult({
        userAddress: address, // FIXME(yoojin): change after connecting wallet.
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
      {notiContextHolder}
      {msgContextHolder}
      <Button onClick={onClickConnectWalletBtn} ><WalletOutlined />{address ? address.slice(0,8)+"..." : "connect wallet"} </Button>
      <Flex justify="space-between">
        <ChatBox modelName={modelAName} prompt={resultA} />
        <ChatBox modelName={modelBName} prompt={resultB} />
      </Flex>
      <Button onClick={onClickResultBtn} value={'model_a'} disabled={status !== ArenaStatus.COMPETING}>Model A</Button>
      <Button onClick={onClickResultBtn} value={'model_b'} disabled={status !== ArenaStatus.COMPETING}>Model B</Button>
      <Button onClick={onClickResultBtn} value={'tie'} disabled={status !== ArenaStatus.COMPETING}>Tie</Button>
      <Button onClick={onClickResultBtn} value={'bad'} disabled={status !== ArenaStatus.COMPETING}>Nothing</Button>
      <PromptInput setParentPrompt={handlePrompt} status={status}/>
      {status === ArenaStatus.END ? (
        <Button onClick={onClickNextBtn}>Next Challenge</Button>
        ) : (<></>) }
      
    </div>
  )
}
