import { ArenaStatus, Chat } from "@/src/types/type";
import "highlight.js/styles/a11y-light.css";
import TextBox from "./text";
import { useEffect, useRef } from "react";
import { cn } from "../utils/cn";

type ChatBoxProps = {
  modelName: string;
  status: ArenaStatus;
  style: React.CSSProperties;
  chatList: Chat[];
  boxClassName?: string;
  titleClassName?: string;
  paragraphClassName?: string;
  isLeftSide: boolean;
};

export default function ChatBox({
  modelName,
  status,
  style,
  chatList,
  boxClassName,
  titleClassName,
  paragraphClassName,
  isLeftSide,
}: ChatBoxProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollToBottom();
  }, [chatList]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const needLoadingBox = (index: number): boolean => {
    return (
      status === ArenaStatus.INFERENCING &&
      index === chatList.length - 1 &&
      index % 2 === 0
    );
  };

  function textboxContent() {
    if (chatList.length > 0) {
      return (
        <div
          ref={scrollRef}
          className={cn(
            paragraphClassName,
            "scrollbar dark:scrollbarDark flex h-full flex-col gap-4 overflow-y-scroll px-5 py-4 text-left",
          )}
        >
          {chatList.map((_chat: Chat, index) => (
            <div
              key={`chat_textBox_Wrap#${index}`}
              className="boder flex flex-col gap-4"
            >
              <TextBox
                key={`chat_textBox_${index}`}
                chat={_chat}
                isLeftSide={isLeftSide}
              />
              {needLoadingBox(index) ? (
                <TextBox
                  key={index + 1}
                  chat={{ text: "", type: "assistant" }}
                  isLoading={true}
                  isLeftSide={isLeftSide}
                />
              ) : (
                <></>
              )}
            </div>
          ))}
        </div>
      );
    }
  }

  return (
    <div
      className={cn(
        "relative flex h-[500px] w-full flex-col overflow-hidden rounded-xl border border-light-l2 bg-light max-mobile:h-[280px] dark:border-dark-b2 dark:bg-dark-b2",
      )}
    >
      <div
        className={cn(
          "flex flex-col items-center self-stretch px-8 py-5 max-mobile:px-5 max-mobile:py-4",
        )}
      >
        <div
          className={cn(
            titleClassName,
            "flex h-12 w-full items-center justify-center rounded-[40px] px-9 text-center text-base font-bold leading-120 text-light max-mobile:h-8 max-mobile:px-4 max-mobile:py-[10px] max-mobile:text-xs",
          )}
        >
          {modelName}
        </div>
      </div>
      {textboxContent()}
      {status === ArenaStatus.END && modelName.includes("👎") && (
        <div className="absolute left-0 top-0 h-full w-full bg-light-b1 opacity-60 dark:bg-dark" />
      )}
    </div>
  );
}
