"use client";

import ChatBox from "@/src/components/chatBox";
import PromptInput from "@/src/components/promptInput";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ArenaStatus, CaptchaStatus, Chat, ChoiceType } from "@/src/types/type";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import React from "react";
import { useSession } from "next-auth/react";
import useAuth from "@/src/lib/auth";
import { toast } from "sonner";
import { processNumber } from "../constant/constant";
import { BattleEvaluateResponse } from "../app/api/arena/arena";
import useInfo from "../utils/handleGetInfo";

const LeftCardStyle: React.CSSProperties = {
  textAlign: "center",
  width: "100%",
  minHeight: "40vh",
  marginLeft: "3rem",
  marginRight: "3px",
};
const RightCardStyle: React.CSSProperties = {
  textAlign: "center",
  width: "100%",
  minHeight: "40vh",
  marginLeft: "3px",
  marginRight: "3rem",
};

export default function ArenaChat() {
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<ArenaStatus>(ArenaStatus.NOTCONNECTED);
  const [battleId, setBattleId] = useState<string | null>(null);
  const [modelA, setModelA] = useState("");
  const [modelB, setModelB] = useState("");
  const [modelAName, setModelAName] = useState("Model A");
  const [modelBName, setModelBName] = useState("Model B");
  const [captcha, setCaptcha] = useState(CaptchaStatus.YET);
  const [modelAChatList, setModelAChatList] = useState<Chat[]>([]);
  const [modelBChatList, setModelBChatList] = useState<Chat[]>([]);
  const [turn, setTurn] = useState(0);

  const { data: session, update } = useSession();
  const { authFetch, checkAuth } = useAuth();
  const { getInfo } = useInfo();

  const testCaptcha = async () => {
    if (!executeRecaptcha) {
      return;
    }
    const gRecaptchaToken = await executeRecaptcha("inquirySubmit");
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
      setCaptcha(CaptchaStatus.TRUE);
    } else {
      setCaptcha(CaptchaStatus.FALSE);
    }
  };

  const openNotification = (rewardData: BattleEvaluateResponse) => {
    const { reward, exp, message } = rewardData;
    const isZeroReward = !reward || reward === 0;

    if ((!session?.user.tier || session?.user.tier === 0) && exp > 0) {
      toast.info("Tier 0 has no reward.");
      return;
    }

    isZeroReward
      ? toast.error(`${message}`)
      : toast.success(`Reward Success! ${processNumber(reward)} AIN`);
  };

  const battleInit = async () => {
    await authFetch("/api/arena/init", {
      method: "POST",
    })
      .then(async (res) => {
        try {
          const result = await res.json();
          setBattleId(result);
        } catch (e) {}
      })
      .catch((e) => {
        alert("Init failed.");
        router.refresh();
      });
  };

  const isMobile = () => {
    return /Mobi/i.test(window.navigator.userAgent);
  };

  useEffect(() => {
    if (isMobile()) {
      // router.push("/m");
      return;
    }
  }, []);

  useEffect(() => {
    testCaptcha();
  }, [executeRecaptcha]);

  useEffect(() => {
    if (
      status === ArenaStatus.NOTCONNECTED &&
      captcha === CaptchaStatus.TRUE &&
      session
    ) {
      resetStates();
    } else if (!session || !session.accessToken) {
      setStatus(ArenaStatus.NOTCONNECTED);
    }
  }, [captcha, session]);

  useEffect(() => {
    setModelAName("Model A");
    setModelBName("Model B");
    switch (status) {
      case ArenaStatus.NOTCONNECTED:
        break;
      case ArenaStatus.READY:
        if (!battleId) battleInit();
      case ArenaStatus.COMPETING:
        break;
      case ArenaStatus.END:
        setModelAName(modelA);
        setModelBName(modelB);
    }
  }, [status]);

  useEffect(() => {
    if (
      turn > 0 &&
      modelAChatList.length / 2 === turn &&
      modelBChatList.length / 2 === turn
    ) {
      setStatus(ArenaStatus.COMPETING);
    }
  }, [modelAChatList.length, modelBChatList.length]);

  const resetStates = () => {
    setStatus(ArenaStatus.READY);
    setBattleId(null);
    setTurn(0);
    setModelAChatList([]);
    setModelBChatList([]);
    setPrompt("");
  };

  const onClickChoiceBtn = async (value: ChoiceType) => {
    setStatus(ArenaStatus.REGISTERING);
    const reqBody = {
      battleId,
      choice: value,
    };
    const choiceRes = await authFetch("/api/arena/choice", {
      method: "POST",
      body: JSON.stringify(reqBody),
    });
    if (choiceRes.ok) {
      const models = await choiceRes.json();
      changeWinnerName(
        value,
        models[ChoiceType.MODELA],
        models[ChoiceType.MODELB],
      );
      authFetch(`/api/arena/reward`, {
        method: "POST",
        body: JSON.stringify({ battleId }),
      }).then(async (res) => {
        if (res.ok) {
          const rewardData: BattleEvaluateResponse = await res.json();
          openNotification(rewardData);
          await getInfo();
        }
      });
      setStatus(ArenaStatus.END);
    }
  };

  const changeWinnerName = (
    winner: ChoiceType,
    modelA: string,
    modelB: string,
  ) => {
    const winnerMark = "👍";
    const loserMark = "👎";
    setModelA(modelA);
    setModelB(modelB);

    switch (winner) {
      case ChoiceType.MODELA:
        setModelA(winnerMark + " " + modelA);
        setModelB(loserMark + " " + modelB);
        break;
      case ChoiceType.MODELB:
        setModelB(winnerMark + " " + modelB);
        setModelA(loserMark + " " + modelA);
        break;
      case ChoiceType.TIE:
        setModelA(winnerMark + " " + modelA);
        setModelB(winnerMark + " " + modelB);
        break;
      case ChoiceType.NOTHING:
        setModelA(loserMark + " " + modelA);
        setModelB(loserMark + " " + modelB);
        break;
    }
  };

  const onClickNextBtn = () => {
    setStatus(ArenaStatus.READY);
    resetStates();
    router.refresh();
  };

  const handlePrompt = async (prompt: string) => {
    if (status === ArenaStatus.READY || status === ArenaStatus.COMPETING) {
      if (prompt.trim() === "") return;
      setStatus(ArenaStatus.INFERENCING);
      setTurn(turn + 1);
      setPrompt(prompt);
      const userChat: Chat = {
        text: prompt,
        type: "user",
      };
      setModelAChatList([...modelAChatList, userChat]);
      setModelBChatList([...modelBChatList, userChat]);
      try {
        // NOTE(yoojin): Inference 가 동시에 두 번 요청가기 때문에 미리 auth check 후 일반 fetch 사용
        await checkAuth();
        fetch("/api/arena/chat", {
          method: "POST",
          body: JSON.stringify({
            battleId,
            modelName: "model_a",
            prompt: prompt,
          }),
        }).then(async (res) => {
          const result = await res.json();
          setModelAChatList((prev) => [
            ...prev,
            {
              text: result,
              type: "assistant",
            },
          ]);
        });
        fetch("/api/arena/chat", {
          method: "POST",
          body: JSON.stringify({
            battleId,
            modelName: "model_b",
            prompt: prompt,
          }),
        }).then(async (res) => {
          const result = await res.json();
          setModelBChatList((prev) => [
            ...prev,
            {
              text: result,
              type: "assistant",
            },
          ]);
        });
        setPrompt("");
      } catch (err) {
        alert(err);
        resetStates();
        router.refresh();
      }
    }
  };
  const messageListContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="" ref={messageListContainerRef}>
      <div className="flex flex-col gap-6 max-desktop:gap-4 max-desktop:px-4 min-desktop:px-0">
        <div className="flex h-[100px] w-full items-center justify-center self-stretch rounded-xl bg-burning-fire bg-cover bg-center bg-no-repeat text-center text-2xl font-extrabold leading-120 text-light text-shadow max-desktop:h-[72px] max-desktop:bg-burning-fire-mobile max-desktop:text-base">
          How about selecting the best answer?
        </div>
        <div className="relative flex w-full flex-row items-center gap-5 max-mobile:mb-[100px] max-mobile:flex-col">
          <ChatBox
            modelName={modelAName}
            status={status}
            style={LeftCardStyle}
            chatList={modelAChatList}
            boxClassName=""
            titleClassName="bg-orange"
            paragraphClassName=""
            isLeftSide={true}
          />
          {status !== ArenaStatus.END && (
            <div className="absolute left-1/2 top-5 z-10 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-light-b1 max-mobile:top-1/2 max-mobile:h-10 max-mobile:w-10 max-mobile:-translate-y-1/2 dark:bg-dark-b1">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-light-t2 text-base font-bold leading-4 text-light max-mobile:h-7 max-mobile:w-7 max-mobile:text-2xs max-mobile:leading-120 dark:bg-dark-t2">
                VS
              </div>
            </div>
          )}

          <ChatBox
            modelName={modelBName}
            status={status}
            style={RightCardStyle}
            chatList={modelBChatList}
            boxClassName=""
            titleClassName="bg-blue"
            paragraphClassName=""
            isLeftSide={false}
          />
        </div>

        <PromptInput
          setParentPrompt={handlePrompt}
          status={status}
          onClickChoiceBtn={onClickChoiceBtn}
          onClickNextBtn={onClickNextBtn}
        />
      </div>
    </div>
  );
}
