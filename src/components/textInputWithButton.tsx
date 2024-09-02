"use client";

import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";

import { themeAtom } from "../lib/recoil";
import { ArenaStatus } from "../types/type";

import ArrowUpLight from "@/public/images/buttons/ArrowUpLight";
import ArrowUpDark from "@/public/images/buttons/ArrowUpDark";
import { cn } from "../utils/cn";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [text, setText] = useState("");
  const [currentTheme, setCurrentTheme] = useState("light");
  const [isFocused, setIsFocused] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleFocus = () => setIsFocused(true);
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

  return (
    <div
      className={cn(
        "flex items-center gap-2 self-stretch rounded-xl px-3 py-2",
        status !== ArenaStatus.READY && status !== ArenaStatus.COMPETING
          ? "bg-light-b2 dark:bg-[#1B1D22]"
          : "bg-light dark:bg-dark-b2",
        isFocused
          ? "dark:border-primary-violet3 border-2 border-primary-violet1Active dark:border-2"
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
        className="h-full flex-1 resize-none break-words bg-light p-2 text-dark placeholder-light-l1 caret-dark focus:outline-none disabled:bg-light-b2 dark:bg-dark-b2 dark:text-light dark:placeholder-dark-t3 dark:caret-light dark:disabled:bg-[#1B1D22]"
        rows={1}
        disabled={
          (status !== ArenaStatus.READY && status !== ArenaStatus.COMPETING) ||
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
    </div>
  );
};

export default TextInputWithButton;
