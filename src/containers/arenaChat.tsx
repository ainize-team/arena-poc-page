"use client";

import ChatBox from "@/components/chatBox";
import PromptInput from "@/components/promptInput";
import { Button, Col, Flex, Row, Space, notification } from "antd";
import { useState, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import axios from "axios";
import { ArenaStatus, CaptchaStatus, Chat, ChoiceType } from "@/types/type";
import ChoiceButton from "@/components/choiceButton";
import { useRecoilState } from "recoil";
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { addressAtom } from "@/lib/recoil";
import useWallet from "@/lib/wallet";
import React from "react";
import { useSession } from "next-auth/react";
import { authFetch } from "@/lib/auth";

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
  const [status, setStatus] = useState<ArenaStatus>(ArenaStatus.NOTCONNECTED);
  const [battleId, setBattleId] = useState<string>("");
  const [modelA, setModelA] = useState("");
  const [modelB, setModelB] = useState("");
  const [modelAName, setModelAName] = useState("");
  const [modelBName, setModelBName] = useState("");
  const [notiApi, notiContextHolder] = notification.useNotification();
  const [captcha, setCaptcha] = useState(CaptchaStatus.YET);
  const [modelAChatList, setModelAChatList] = useState<Chat[]>([]);
  const [modelBChatList, setModelBChatList] = useState<Chat[]>([]);
  const [turn, setTurn] = useState(0);

  const { data: session } = useSession();

  const {
    isValidChain,
    setWalletEventHandler,
  } = useWallet();

  const testCaptcha = async() => {
    if (!executeRecaptcha) {
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

    if (response.data && response.data.success === true) {
      setCaptcha(CaptchaStatus.TRUE)
    } else {
      setCaptcha(CaptchaStatus.FALSE)
    }
  };

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
    await authFetch("/api/arena/init", {
      method: "POST",
    }).then(async (res) => {
      try {
        const result = await res.json();
        setBattleId(result);
      } catch (e) {
        console.log('e :>> ', e);
      }
    });
  }

  const isMobile = () => {
    return /Mobi/i.test(window.navigator.userAgent);
  };

  useEffect(() => {
    if (isMobile()) {
      router.push("/m");
      return;
    }
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
    if (
      status === ArenaStatus.NOTCONNECTED && 
      captcha === CaptchaStatus.TRUE &&
      session
    ) {
      setStatus(ArenaStatus.READY);
      resetStates();
    } else {
      setStatus(ArenaStatus.NOTCONNECTED);
    }
  }, [captcha])

  useEffect(() => {
    console.log('turn, modelAChatList.length, modelBChatList.length :>> ', turn, modelAChatList.length, modelBChatList.length);
    if (turn > 0 && modelAChatList.length / 2 === turn && modelBChatList.length / 2 === turn) {
      setStatus(ArenaStatus.COMPETING);
    }
  }, [modelAChatList.length, modelBChatList.length])

  const resetStates = () => {
    setPrompt("");
    pickAndSetModels();
    setModelAChatList([]);
    setModelBChatList([]);
    setStatus(ArenaStatus.READY);
  }

  const onClickChoiceBtn = async (value: ChoiceType) => {
    setStatus(ArenaStatus.REGISTERING);
    const reqBody = {
      battleId,
      choice: value,
    }
    const models = await (await authFetch("/api/arena/result", {
      method: "POST",
      body: JSON.stringify(reqBody),
    })).json();
    changeWinnerName(value, models[ChoiceType.MODELA], models[ChoiceType.MODELB]);
    setStatus(ArenaStatus.END);
    const reward = await (await authFetch(`/api/arena/reward`, {
      method: "POST",
      body: JSON.stringify({battleId})
    })).json();
    // openNotification(rewardData);
  }

  const changeWinnerName = (winner: ChoiceType, modelA: string, modelB: string) => {
    const winnerMark = "🎉";
    setModelA(modelA);
    setModelB(modelB);
    
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
    const rand = Math.floor(Math.random() * 20);
    if (rand === 19) { 
      testCaptcha();
    }
    router.refresh();
  }

  const handlePrompt = async (prompt: string) => {
    if (status === ArenaStatus.READY || status === ArenaStatus.COMPETING) {
      if (prompt.trim() === "") return;
      setStatus(ArenaStatus.INFERENCING);
      setTurn(turn + 1);
      setPrompt(prompt);
      const userChat: Chat = {
        text: prompt,
        type: "user"
      }
      modelAChatList.push(userChat);
      modelBChatList.push(userChat);
      try {
        authFetch("/api/arena/chat", {
          method: "POST",
          body: JSON.stringify({
            battleId,
            modelName: "model_a",
            prompt: prompt,
          }),
        }).then(async (res) => {
          const result = await res.json();
          modelAChatList.push({
            text: result,
            type: "assistant"
          });
        });
        authFetch("/api/arena/chat", {
          method: "POST",
          body: JSON.stringify({
            battleId, 
            modelName: "model_b",
            prompt: prompt,
          }),
        }).then(async (res) => {
          const result = await res.json();
          modelBChatList.push({
            text: result,
            type: "assistant"
          });
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
      {/* {notiContextHolder} */}{/* NOTE(yoojin): Hide reward noti */}
      <Flex justify="center" style={{marginTop: "10px"}}>
        <ChatBox modelName={modelAName} status={status} style={LeftCardStyle} chatList={modelAChatList} />
        <ChatBox modelName={modelBName} status={status} style={RightCardStyle} chatList={modelBChatList} />
      </Flex>
        {status !== ArenaStatus.END ? (
          <>
            <PromptInput setParentPrompt={handlePrompt} status={status} />
            <Row justify="space-evenly">
              <Col span={3} />
              <Col span={3}><ChoiceButton onClick={onClickChoiceBtn} value={ChoiceType.MODELA} arenaStatus={status} /></Col>
              <Col span={3}><ChoiceButton onClick={onClickChoiceBtn} value={ChoiceType.MODELB} arenaStatus={status} /></Col>
              <Col span={3}><ChoiceButton onClick={onClickChoiceBtn} value={ChoiceType.TIE} arenaStatus={status} /></Col>
              <Col span={3}><ChoiceButton onClick={onClickChoiceBtn} value={ChoiceType.NOTHING} arenaStatus={status} /></Col>
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

