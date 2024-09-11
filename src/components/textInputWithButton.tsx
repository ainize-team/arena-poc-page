"use client";

import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import ReactMarkdown from "react-markdown";

import { modalState, themeAtom } from "../lib/recoil";
import { ArenaStatus } from "../types/type";
import { cn } from "../utils/cn";
import Modal from "./modal";
import ErrorModalChildren from "./errorModalChildren";
import { isDesktopBrowser } from "../constant/constant";
import onClickLoginBtn from "../utils/handleLogin";

import ArrowUpLight from "@/public/images/buttons/ArrowUpLight";
import ArrowUpDark from "@/public/images/buttons/ArrowUpDark";

type TextInputWithButtonProps = {
  placeholder?: string;
  isLoading: boolean;
  status: ArenaStatus;
  onClickChoiceBtn: Function;
  onClickNextBtn: Function;
  onClickSendBtn: Function;
  handlePrompt: Function;
  value: string;
  disabled?: boolean;
};

const TextInputWithButton = ({
  placeholder = "",
  isLoading = false,
  status,
  onClickChoiceBtn,
  onClickNextBtn,
  onClickSendBtn,
  handlePrompt,
  value,
  disabled = false,
}: TextInputWithButtonProps) => {
  const [theme, setTheme] = useRecoilState(themeAtom);
  const [isOpen, setIsOpen] = useRecoilState(modalState);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [text, setText] = useState("");
  const [currentTheme, setCurrentTheme] = useState("light");
  const [isFocused, setIsFocused] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isComponentMounted, setIsComponentMounted] = useState(false);

  const handleFocus = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    if (status === ArenaStatus.NOTCONNECTED) {
      event.target.blur();
      openModal();
    } else {
      setIsFocused(true);
    }
  };

  const handleBlur = () => setIsFocused(false);

  const checkTheme = (theme: string) => {
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      setCurrentTheme(systemTheme);
    } else {
      setCurrentTheme(theme);
    }
  };

  useEffect(() => {
    setIsComponentMounted(true);
  }, []);

  useEffect(() => {
    checkTheme(theme);
  }, [theme]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // setText(e.target.value);
    handlePrompt(e);
    autoResize();
  };

  const handleSend = () => {
    onClickSendBtn();
    handleBlur();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    autoResize();
  }, [value]);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 self-stretch rounded-xl px-3 py-2",
        status !== ArenaStatus.READY && status !== ArenaStatus.COMPETING
          ? "bg-light-b2 dark:bg-[#1B1D22]"
          : "bg-light dark:bg-dark-b2",
        isFocused
          ? "border-2 border-primary-violet1Active dark:border-2 dark:border-primary-violet3"
          : "border border-light-l1 dark:border dark:border-dark-l2",
      )}
    >
      <textarea
        id="input-textarea"
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        placeholder={placeholder}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={cn(
          "h-full flex-1 resize-none break-words bg-light p-2 text-dark placeholder-light-l1 caret-dark focus:outline-none disabled:bg-light-b2 dark:bg-dark-b2 dark:text-light dark:placeholder-dark-t3 dark:caret-light dark:disabled:bg-[#1B1D22]",
          status === ArenaStatus.NOTCONNECTED &&
            "bg-light-b2 dark:bg-[#1B1D22]",
        )}
        rows={1}
        disabled={
          status === ArenaStatus.NOTCONNECTED
            ? false
            : (status !== ArenaStatus.READY &&
                status !== ArenaStatus.COMPETING) ||
              disabled
        }
      />
      <div
        onClick={handleSend}
        className={cn(
          "group cursor-pointer rounded-lg p-[6px]",
          status !== ArenaStatus.READY && status !== ArenaStatus.COMPETING
            ? "hover:bg-light-b2 dark:hover:bg-dark-b2"
            : "hover:bg-light-b2 dark:hover:bg-dark-b4",
        )}
      >
        {isLoading ? (
          <Spin
            indicator={
              <LoadingOutlined
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                }}
                className="text-[#62667D80] dark:text-light/50"
                spin
              />
            }
          />
        ) : currentTheme === "light" ? (
          <ArrowUpLight />
        ) : (
          <ArrowUpDark
            strokeColor="#9EA0B7"
            className={cn(
              "",
              status !== ArenaStatus.READY && status !== ArenaStatus.COMPETING
                ? ""
                : "group-hover:stroke-light",
            )}
          />
        )}
      </div>

      {isComponentMounted && (
        <Modal
          onRequestClose={closeModal}
          bottomButtonHandler={onClickLoginBtn}
          isDesktop={isDesktopBrowser()}
          isAuthModal={true}
        >
          <div className="flex flex-col items-center justify-start self-stretch max-desktop:gap-5 min-desktop:gap-9">
            <div className="w-full max-desktop:h-5 min-desktop:h-9"></div>
            <div className="flex max-w-[500px] flex-col items-center justify-center max-desktop:gap-4 min-desktop:gap-[30px]">
              <div className="text-center text-dark max-desktop:text-base max-desktop:leading-8 min-desktop:text-2.5xl min-desktop:leading-150 dark:text-light">
                <ReactMarkdown>{"**Please log in to continue**"}</ReactMarkdown>
              </div>
              <div className="text-center font-normal text-dark max-desktop:text-xs min-desktop:text-xl dark:text-light">
                <ReactMarkdown
                  components={{
                    a: (props: any) => (
                      <a
                        style={{ fontWeight: 700, textDecoration: "underline" }}
                        {...props}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    ),
                  }}
                >
                  {`Log in with Google and experience even smarter\n\nAI responses on AI Network LLM Arena.`}
                </ReactMarkdown>
              </div>
            </div>
            <div className="w-full max-desktop:h-14 min-desktop:h-24"></div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TextInputWithButton;
