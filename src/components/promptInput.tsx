"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpOutlined } from "@ant-design/icons";
import { ArenaStatus, ChoiceType } from "@/src/types/type";
import TextInputWithButton from "./textInputWithButton";
import ChoiceButton from "./choiceButton";

type promptProps = {
  setParentPrompt: Function;
  status: ArenaStatus;
  disabled?: boolean;
  onClickChoiceBtn: Function;
  onClickNextBtn: () => void;
};

export default function PromptInput({
  setParentPrompt,
  status,
  disabled = false,
  onClickChoiceBtn,
  onClickNextBtn,
}: promptProps) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const promptPlaceHolder = (status: ArenaStatus) => {
    switch (status) {
      case ArenaStatus.NOTCONNECTED:
      // return "Connect your AIN wallet first.";
      case ArenaStatus.READY:
      case ArenaStatus.COMPETING:
      case ArenaStatus.REGISTERING:
        return "Type your prompt and press ENTER.";
      case ArenaStatus.INFERENCING:
        return "Inferencing... Please wait.";
      case ArenaStatus.END:
        return "Select next challange first.";
    }
  };

  useEffect(() => {
    if (status === ArenaStatus.INFERENCING) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [status]);

  const handlePrompt = (event: any) => {
    setPrompt(event.target.value);
  };

  const onClickSendBtn = async () => {
    setParentPrompt(prompt);
    setPrompt("");
  };

  const loadingBTN = () => {
    if (isLoading === true) {
      return true;
    } else {
      return <ArrowUpOutlined />;
    }
  };

  // useEffect(() => {
  //   const handleResize = () => {
  //     const inputContainer = document.getElementById("input-container")!;
  //     const viewportHeight = window.innerHeight;
  //     const containerHeight = inputContainer.offsetHeight;
  //     const newBottom = viewportHeight - window.visualViewport!.height;
  //     inputContainer.style.bottom = `${newBottom}px`;
  //   };

  //   // Listen for the resize event
  //   window.visualViewport!.addEventListener("resize", handleResize);

  //   // Initial call to set the correct position
  //   handleResize();

  //   return () => {
  //     window.visualViewport!.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  // useEffect(() => {
  //   const preventScroll = (e) => {
  //     e.preventDefault();
  //     e.stopPropagation();
  //     return false;
  //   };

  //   const lockScroll = () => {
  //     document.body.style.overflow = "hidden";
  //     document.addEventListener("touchmove", preventScroll, { passive: false });
  //   };

  //   const unlockScroll = () => {
  //     document.body.style.overflow = "";
  //     document.removeEventListener("touchmove", preventScroll);
  //   };

  //   const textArea = document.getElementById("input-textarea");

  //   if (textArea) {
  //     textArea.addEventListener("focus", lockScroll);
  //     textArea.addEventListener("blur", unlockScroll);
  //   }

  //   return () => {
  //     if (textArea) {
  //       textArea.removeEventListener("focus", lockScroll);
  //       textArea.removeEventListener("blur", unlockScroll);
  //     }
  //   };
  // }, []);

  // useEffect(() => {
  //   const handleFocus = () => {
  //     document.body.style.position = "fixed";
  //     document.body.style.width = "100%";
  //   };

  //   const handleBlur = () => {
  //     document.body.style.position = "";
  //     document.body.style.width = "";
  //   };

  //   const textArea = document.getElementById("input-textarea");

  //   if (textArea) {
  //     textArea.addEventListener("focus", handleFocus);
  //     textArea.addEventListener("blur", handleBlur);
  //   }

  //   return () => {
  //     if (textArea) {
  //       textArea.removeEventListener("focus", handleFocus);
  //       textArea.removeEventListener("blur", handleBlur);
  //     }
  //   };
  // }, []);

  return (
    <div
      id="input-container"
      className="z-layout flex flex-col max-mobile:fixed max-mobile:bottom-0 max-mobile:left-0 max-mobile:right-0 max-mobile:border-t max-mobile:border-t-light-l2 max-mobile:bg-light-b1 max-mobile:px-[10px] max-mobile:py-4 min-mobile:gap-6 max-mobile:dark:border-t-dark-l2 max-mobile:dark:bg-dark"
    >
      <TextInputWithButton
        placeholder={promptPlaceHolder(status)}
        isLoading={isLoading}
        status={status}
        onClickChoiceBtn={onClickChoiceBtn}
        onClickNextBtn={onClickNextBtn}
        onClickSendBtn={onClickSendBtn}
        handlePrompt={handlePrompt}
        value={prompt}
        disabled={disabled}
      />
      {(status === ArenaStatus.COMPETING || status === ArenaStatus.END) && (
        <div className="flex items-center justify-between rounded-xl border-2 border-light-l2 py-4 max-mobile:border-0 max-mobile:px-0 max-mobile:pb-0 min-mobile:px-5 dark:border-dark-b2">
          <p className="text-base font-normal leading-150 text-light-t2 max-mobile:hidden">
            {status !== ArenaStatus.END
              ? "Which response was better?"
              : "Let's compare more responses!"}
          </p>
          <div className="flex items-center self-stretch max-mobile:w-full max-mobile:justify-between min-mobile:gap-6">
            {status === ArenaStatus.COMPETING ? (
              <>
                <ChoiceButton
                  onClick={onClickChoiceBtn}
                  value={ChoiceType.MODELA}
                  arenaStatus={status}
                />
                <ChoiceButton
                  onClick={onClickChoiceBtn}
                  value={ChoiceType.MODELB}
                  arenaStatus={status}
                />
                <ChoiceButton
                  onClick={onClickChoiceBtn}
                  value={ChoiceType.TIE}
                  arenaStatus={status}
                />
                <ChoiceButton
                  onClick={onClickChoiceBtn}
                  value={ChoiceType.NOTHING}
                  arenaStatus={status}
                />
              </>
            ) : status === ArenaStatus.END ? (
              <button
                className="chat items-center justify-center rounded-lg border border-light-l2 bg-light px-3 py-2 text-sm font-bold text-light-t2 hover:bg-light-b3 disabled:opacity-50 max-mobile:w-full max-mobile:px-[14px] max-mobile:py-[14px] dark:border-dark-b4 dark:bg-dark-b4 dark:text-light dark:hover:bg-dark-b3"
                onClick={onClickNextBtn}
              >
                Next Challenge
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
