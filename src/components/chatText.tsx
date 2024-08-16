import { Chat } from "@/types/type";
import { Spin } from "antd";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import styled from "styled-components";
import Image from "next/image";

type Props = {
  chat: Chat
  modelType: "model_a" | "model_b"
  isLoading?: boolean
}

const ChatDiv = styled.div`
  display: flex ;
  gap: 10px;
`

const ModelProfile = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 40px;
  background-color: rgba(241, 243, 248, 1);
  font-family: Manrope;
  font-size: 12px;
  font-weight: 700;
  line-height: 20px;
  text-align: center;
`

const AProfileText = styled.text`
  color: rgba(255, 130, 60, 1);
`

const BProfileText = styled.text`
  color: rgba(75, 136, 255, 1);
`

const TextArea = styled.div`
  width: 344px;
  font-family: Manrope;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: left;
`

export default function ChatText({ chat, modelType, isLoading = false }: Props) {

  const profile = () => {
    if (chat.type === "user") {
      return  (
        <Image 
          src="/image/profile_default.png"
          alt="profile"
          width={20}
          height={20}
          style={{
            borderRadius: "40px"
          }}
        />
      );
    } else {
      return (
        <ModelProfile>
          {
            modelType === "model_a" ? 
            <AProfileText>A</AProfileText> : 
            <BProfileText>B</BProfileText>  
          }
        </ModelProfile>
      )
    }
  }

  return (
    <ChatDiv>
      {profile()}
      <TextArea>
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
            {chat.text}
        </ReactMarkdown>
      </TextArea>
    </ChatDiv>
  );
}
