"use client";

import ChatBox from "@/components/chatBox";
import PromptInput from "@/components/promptInput";
import { Button, Col, Flex, Row, Space, notification } from "antd";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { chatResult, chatReward } from "@/app/api/arena/arena";
import { APIStatus, ArenaStatus, ChatResultReqBody, ChoiceType } from "@/type";
import ChoiceButton from "@/components/choiceButton";
import { useRecoilState } from "recoil";
import { addressAtom } from "@/lib/wallet";

export default function ArenaChat() {
  const router = useRouter();

  const [prompt, setPrompt] = useState("");
  const [address, setAddress] = useRecoilState (addressAtom);
  const [status, setStatus] = useState<ArenaStatus>(ArenaStatus.NOTCONNECTED);
  const [modelA, setModelA] = useState("");
  const [modelB, setModelB] = useState("");
  const [modelAName, setModelAName] = useState("");
  const [modelBName, setModelBName] = useState("");
  const [resultA, setResultA] = useState("");
  const [resultB, setResultB] = useState("");
  const [modelABtnDisabled, setModelABtnDisabled] = useState(true);
  const [modelBBtnDisabled, setModelBBtnDisabled] = useState(true);
  const [notiApi, notiContextHolder] = notification.useNotification();
  
  const openNotification = (rewardData: any) => {
    notiApi.info({
      message: "Reward Success!",
      description:`Reward: ${rewardData.reward} AIN`,
      placement: "topRight",
    });
  };

  const pickAndSetModels = async () => {
    await fetch("/api/arena/init", {
      method: "GET",
    }).then(async (res) => {
      const result = await res.json();
      setModelA(result[0]);
      setModelB(result[1]);
    });
  }

  useEffect(() => {
    const setModels = async () => {
      await pickAndSetModels();
    }
    setModels();
  }, [])

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

  useEffect(() => {
    if (resultA !== "" && resultB !== "") {
      setStatus(ArenaStatus.COMPETING);
    }
  }, [resultA, resultB])

  const resetStates = () => {
    setPrompt("");
    pickAndSetModels();
    setStatus(ArenaStatus.READY);
    setResultA("");
    setResultB("");
  }

  const onClickChoiceBtn = async (value: ChoiceType) => {
    setStatus(ArenaStatus.REGISTERING);
    try {
      const chatResultParams: ChatResultReqBody = {
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
      };
      const battleId = await (await fetch("/api/arena/result", {
        method: "POST",
        body: JSON.stringify(chatResultParams),
      })).json();
      setStatus(ArenaStatus.END);
      const reward = await fetch(`/api/arena/reward/${battleId}`, {
        method: "GET",
      });
      openNotification(await reward.json());
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
      if (prompt.trim() === "") return;
      setStatus(ArenaStatus.INFERENCING);
      setPrompt(prompt);
      try {
        fetch("/api/arena/chat", {
          method: "POST",
          body: JSON.stringify({
            modelName: modelA,
            prompt: prompt,
          }),
        }).then(async (res) => {
          const result = await res.json();
          setModelABtnDisabled(res.status !== APIStatus.OK);
          setResultA(result);
        });
        fetch("/api/arena/chat", {
          method: "POST",
          body: JSON.stringify({
            modelName: modelB,
            prompt: prompt,
          }),
        }).then(async (res) => {
          const result = await res.json();
          setModelBBtnDisabled(res.status !== APIStatus.OK);
          setResultB(result);
        });
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
      <Flex justify="center" style={{marginTop: "10px"}}>
        <ChatBox modelName={modelAName} status={status} prompt={resultA} />
        <ChatBox modelName={modelBName} status={status} prompt={resultB} />
      </Flex>
        {status !== ArenaStatus.END ? (
          <>
            <PromptInput setParentPrompt={handlePrompt} status={status}/>
            <Row justify="space-evenly">
              <Col span={3} />
              <Col span={3}><ChoiceButton onClick={onClickChoiceBtn} value={ChoiceType.MODELA} arenaStatus={status} disabled={modelABtnDisabled}  /></Col>
              <Col span={3}><ChoiceButton onClick={onClickChoiceBtn} value={ChoiceType.MODELB} arenaStatus={status} disabled={modelBBtnDisabled}  /></Col>
              <Col span={3}><ChoiceButton onClick={onClickChoiceBtn} value={ChoiceType.TIE} arenaStatus={status} disabled={modelABtnDisabled || modelBBtnDisabled}  /></Col>
              <Col span={3}><ChoiceButton onClick={onClickChoiceBtn} value={ChoiceType.NOTHING} arenaStatus={status}/></Col>
              <Col span={3} />
            </Row>
          </>
        ) : (
          <Flex justify="center" style={{width: "100%"}}>
              <Button 
                style={{
                  height: "50px",
                  width: "60%",
                }}
                onClick={onClickNextBtn}
              >Next Challenge</Button>
          </Flex>
        )}
      <div />
    </Space>
  )
}
