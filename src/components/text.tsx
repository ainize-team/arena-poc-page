import { useEffect, useState } from "react";
import { Chat } from "@/src/types/type";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { useRecoilState } from "recoil";

import { themeAtom, userInfoState } from "../lib/recoil";
import { cn } from "../utils/cn";
import UserProfileImage from "./userProfileImage";

import ModelAProfileDark from "@/public/images/battle/ModelAProfileDark.svg";
import ModelAProfileLight from "@/public/images/battle/ModelAProfileLight.svg";
import ModelBProfileDark from "@/public/images/battle/ModelBProfileDark.svg";
import ModelBProfileLight from "@/public/images/battle/ModelBProfileLight.svg";

type Props = {
  chat: Chat;
  isLoading?: boolean;
  isLeftSide: boolean;
};

export default function TextBox({
  chat,
  isLoading = false,
  isLeftSide,
}: Props) {
  const [theme, setTheme] = useRecoilState(themeAtom);
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);

  const [currentTheme, setCurrentTheme] = useState("light");

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

  return (
    <div
      className={cn(
        "flex w-full items-start justify-center gap-2 self-stretch",
      )}
    >
      <div className="flex h-6 w-6 pt-[1px]">
        {chat.type === "user" ? (
          <UserProfileImage
            width={20}
            height={20}
            imageUrl={userInfo?.user.picture}
            onClick={() => {}}
          />
        ) : (
          <UserProfileImage
            width={20}
            height={20}
            imageUrl={
              currentTheme === "light"
                ? isLeftSide
                  ? ModelAProfileLight
                  : ModelBProfileLight
                : isLeftSide
                  ? ModelAProfileDark
                  : ModelBProfileDark
            }
            onClick={() => {}}
          />
        )}
      </div>

      <div className="flex w-full flex-wrap">
        {isLoading ? (
          <Spin
            indicator={
              <LoadingOutlined
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                }}
                className="text-dark dark:text-light"
                spin
              />
            }
          />
        ) : (
          <div
            className={
              "chat flex w-full flex-col gap-2 text-sm font-normal leading-5 text-dark dark:text-light"
            }
            style={{
              overflowX: "hidden",
              wordBreak: "break-word",
              // whiteSpace: "pre-wrap",
            }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              className={cn(
                currentTheme === "light"
                  ? "markdown-content"
                  : "markdown-contentDark",
              )}
              components={{
                a: ({ node, ...props }) => (
                  <a {...props} target="_blank" rel="noopener noreferrer" />
                ),
              }}
            >
              {chat.text}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
