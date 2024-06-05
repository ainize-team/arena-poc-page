"use client";

import ChatBox from "@/components/chatBox";
import PromptInput from "@/components/promptInput";
import { Button, Col, Flex, Row, Space, notification } from "antd";
import { useState, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import axios from "axios";
import { ArenaStatus, CaptchaStatus, ChatResultReqBody, ChoiceType } from "@/type";
import ChoiceButton from "@/components/choiceButton";
import { useRecoilState } from "recoil";
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { addressAtom } from "@/lib/recoil";
import useWallet from "@/lib/wallet";
import React from "react";

const LeftCardStyle: React.CSSProperties = {
  textAlign: "center",
  width: "100%",
  minHeight: "40vh",
  marginLeft: "3rem",
  marginRight: "3px",
}
const RightCardStyle: React.CSSProperties = {
  textAlign: "center",
  width: "100%",
  minHeight: "40vh",
  marginLeft: "3px",
  marginRight: "3rem",
}

export default function ArenaChat() {
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [prompt, setPrompt] = useState("");
  const [address, setAddress] = useRecoilState<string>(addressAtom);
  const [status, setStatus] = useState<ArenaStatus>(ArenaStatus.NOTCONNECTED);
  const [modelA, setModelA] = useState("");
  const [modelB, setModelB] = useState("");
  const [modelAName, setModelAName] = useState("");
  const [modelBName, setModelBName] = useState("");
  const [resultA, setResultA] = useState("");
  const [resultB, setResultB] = useState("");
  const [notiApi, notiContextHolder] = notification.useNotification();
  const [captcha, setCaptcha] = useState(CaptchaStatus.YET);  

  const {
    isValidChain,
    setWalletEventHandler,
  } = useWallet();

  const testCaptcha = async()=>{
    if(!executeRecaptcha) {
      console.log("not available to execute recaptcha");
      return;
    }
    const gRecaptchaToken = await executeRecaptcha('inquirySubmit');
    const response = await axios({
      method: "post",
      url: "/api/arena/recaptchaSubmit",
      data: {
        gRecaptchaToken,
      },
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    });

    if (response?.data?.success === true) {
      console.log(`Success with score: ${response?.data?.score}`);
      setCaptcha(CaptchaStatus.TRUE)
    } else {
      console.log(`Failure with score: ${response?.data?.score}`);
      setCaptcha(CaptchaStatus.FALSE)
    }

  }
  const openNotification = (rewardData: any) => {
    const isZeroReward = rewardData.reward === 0;
    notiApi.info({
      message: isZeroReward ? "Reward Failed." : "Reward Success!",
      description:
        isZeroReward ? rewardData.reason : `Reward: ${rewardData.reward} AIN`,
      placement: "topRight",
      duration: 0,
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
    setWalletEventHandler();
  }, [])

  useEffect(()=>{
    testCaptcha();
  },[executeRecaptcha])

  useEffect(()=>{
    if(captcha == CaptchaStatus.FALSE){
      redirect("/leaderboard")
    }
  },[captcha])
  useEffect(() => {
    switch(status) {
      case ArenaStatus.NOTCONNECTED:
      case ArenaStatus.READY:
      case ArenaStatus.COMPETING: 
        setModelAName("Model A");
        setModelBName("Model B");
        break;
      case ArenaStatus.END:
        setModelAName(modelA);
        setModelBName(modelB);
    }
  }, [status])

  useEffect(()=> {
    if (address !== "" && captcha == CaptchaStatus.TRUE) {
      setStatus(ArenaStatus.READY);
    } else {
      setStatus(ArenaStatus.NOTCONNECTED);
    }
  }, [address, captcha])

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
      changeWinnerName(value);
      setStatus(ArenaStatus.END);
      const reward = await fetch(`/api/arena/reward/${battleId}`, {
        method: "GET",
      });
      const rewardData = await reward.json();
      openNotification(rewardData);
    } catch (err) {
      alert(`${err}.\n If the error is repeated, please refresh the page.`);
    }
  }

  const changeWinnerName = (winner: ChoiceType) => {
    const winnerMark = "🎉";
    switch(winner) {
      case ChoiceType.MODELA:
        setModelA(winnerMark + modelA);
        break;
      case ChoiceType.MODELB:
        setModelB(winnerMark + modelB);
        break;
      case ChoiceType.TIE:
        setModelA(winnerMark + modelA);
        setModelB(winnerMark + modelB);
        break;
      case ChoiceType.NOTHING:
        break;
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
        <ChatBox modelName={modelAName} status={status} style={LeftCardStyle} prompt={resultA} />
        <ChatBox modelName={modelBName} status={status} style={RightCardStyle} prompt={resultB} />
      </Flex>
        {status !== ArenaStatus.END ? (
          <>
            <PromptInput setParentPrompt={handlePrompt} status={status} disabled={!isValidChain}/>
            <Row justify="space-evenly">
              <Col span={3} />
              <Col span={3}><ChoiceButton onClick={onClickChoiceBtn} value={ChoiceType.MODELA} arenaStatus={status} disabled={!isValidChain}  /></Col>
              <Col span={3}><ChoiceButton onClick={onClickChoiceBtn} value={ChoiceType.MODELB} arenaStatus={status} disabled={!isValidChain}  /></Col>
              <Col span={3}><ChoiceButton onClick={onClickChoiceBtn} value={ChoiceType.TIE} arenaStatus={status} disabled={!isValidChain}  /></Col>
              <Col span={3}><ChoiceButton onClick={onClickChoiceBtn} value={ChoiceType.NOTHING} arenaStatus={status} disabled={!isValidChain}/></Col>
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

