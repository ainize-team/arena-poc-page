"use client";

import { useEffect, useState } from "react";
import { Input } from 'antd';
import { ArrowUpOutlined } from "@ant-design/icons";
import { ArenaStatus } from "@/type";

const { Search } = Input;

type promptProps = {
  setParentPrompt: Function,
  status: ArenaStatus,
  disabled?: boolean,
}

export default function PromptInput({setParentPrompt, status, disabled = false}: promptProps) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const promptPlaceHolder = (status:ArenaStatus) => {
    switch(status) {
      case ArenaStatus.NOTCONNECTED:
        return "Connect your AIN wallet first.";
      case ArenaStatus.READY:
        return "Type your prompt and press ENTER.";
      case ArenaStatus.INFERENCING:
        return "Inferencing... Please wait.";
      case ArenaStatus.COMPETING:
        return "Select winner first.";
      case ArenaStatus.END:
        return "Select next challange first.";
    }
  }
  useEffect(() =>{
    if (status == ArenaStatus.INFERENCING){
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  },[status])

  const handlePrompt = (event: any) => {
    setPrompt(event.target.value);
  }

  const onClickSendBtn = async () => {
    setParentPrompt(prompt);
  }

  const loadingBTN= () => {
    if(isLoading === true){
      return true
    } else {
      return <ArrowUpOutlined />
    }
  }

  return (
    <Search 
      placeholder={promptPlaceHolder(status)}
      onChange={handlePrompt}
      onSearch={onClickSendBtn}
      value={prompt}
      loading={isLoading} 
      style={{
        paddingTop: 10,
        width: "100%",
        paddingInline: 48,
      }}
      enterButton={loadingBTN()}
      disabled={status !== ArenaStatus.READY}
    />
  );
}
