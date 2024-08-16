import { ArenaStatus, Chat } from "@/types/type";
import { useEffect, useRef } from "react";
import styled from "styled-components"
import ChatText from "./chatText";

type ChatBoxProps = {
  modelName: string,
  status: ArenaStatus
  modelType: "model_a" | "model_b",
  chatList: Chat[],
};

const Container = styled.div`
  background-color: rgba(255, 255, 255, 1);
  width: 430px;
  height: 400px;
  border-radius: 12px 12px 12px 12px;
  border: 1px solid rgba(230, 234, 244, 1);
`

const Header = styled.div`
  width: 430px;
  height: 88px;
  padding: 20px 35px 20px 35px;
  gap: 10px;
  opacity: 0px;
`

const Label = styled.div`
  width: 360px;
  height: 48px;
  padding: 20px 35px 20px 35px;
  border-radius: 40px 40px 40px 40px;
  border: 0px 0px 1px 0px;
  font-family: Manrope;
  font-size: 16px;
  font-weight: 700;
  line-height: 19.2px;
  color: white;
`

const Body = styled.div`
  display: flex;
  Flex-direction: column;
  width: 430px;
  height: 312px;
  padding: 0px 25px 0px 25px;
  gap: 16px;
  text-align: left;
  overflow-x: auto;
`

export default function ChatBox({ modelName, status, modelType, chatList }: ChatBoxProps) {
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

  function ChatTextContent() {
    if (chatList.length > 0) {
      return (
        <>
          {
            chatList.map((_chat: Chat, index) =>
              <>
                <ChatText key={index} chat={_chat} modelType={modelType}/>
                {
                  needLoadingBox(index) ? <ChatText key={index+1} chat={{text: "", type:"assistant"}} isLoading={true} modelType={modelType} /> : <></>
                }
              </>
            )  
          }
        </>
      )
    }
  }

  return (
    <Container>
      <Header>
        <Label style={{
          backgroundColor: modelType === "model_a" ? "rgba(255, 130, 60, 1)" : "rgba(75, 136, 255, 1)"
        }}>
          {modelName}
        </Label>
      </Header>
      <Body ref={scrollRef}>
        {ChatTextContent()}
      </Body>
    </Container>
  )
}
