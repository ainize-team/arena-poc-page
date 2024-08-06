import { ArenaStatus, Chat } from "@/types/type";
import { Card, Typography, Spin } from "antd";
import "highlight.js/styles/a11y-light.css";
import TextBox from "./text";
import { useEffect, useRef } from "react";

const { Paragraph } = Typography;

type ChatBoxProps = {
  modelName: string,
  status: ArenaStatus
  style: React.CSSProperties,
  chatList: Chat[],
};

export default function ChatBox({ modelName, status, style, chatList}: ChatBoxProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    scrollToBottom();
  }, [chatList])

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }

  const needLoadingBox = (index: number): boolean => {
    return (
      status === ArenaStatus.INFERENCING &&
      index === chatList.length - 1 &&
      index % 2 === 0
    )
  }

  function textboxContent() {
    if (chatList.length > 0) {
      return <Paragraph 
        ref={scrollRef}
        style={{
          height: `${40 - 3}vh`, // FIXME(yoojin): change height to not constant value.
          textAlign: "left",
          overflow: "auto",
        }
      }>
        {
          chatList.map((_chat: Chat, index) =>
            <>
              <TextBox key={index} chat={_chat}/>
              {
                needLoadingBox(index) ? <TextBox key={index+1} chat={{text: "", type:"assistant"}} isLoading={true} /> : <></>
              }
            </>
          )  
        }
      </Paragraph>
    }
  }

  return (
    <Card
      title={modelName}
      size="small"
      bordered={false}
      styles={{
        header: {
          background: status === ArenaStatus.END ? "#fcee8c" : "#ffffff",
        }
      }}
      style={style}
    >
    {textboxContent()}
    </Card>
  );
}
