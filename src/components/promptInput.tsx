"use client";

import { useEffect, useState } from "react";
import { Input } from 'antd';
import { ArrowUpOutlined } from "@ant-design/icons";
import { ArenaStatus } from "@/type";

const { Search } = Input;

type promptProps = {
  setParentPrompt: Function,
  status: ArenaStatus
  disabled?: boolean
}

export default function PromptInput({setParentPrompt, status, disabled = false}: promptProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() =>{
    if (status == ArenaStatus.INFERENCING){
      setIsLoading(true);
    }else{
      setIsLoading(false)
    }
  },[status])

  const handlePrompt = (event: any) => {
    setPrompt(event.target.value);
  }

  const onClickSendBtn = async() => {
    setParentPrompt(prompt);
    setPrompt('');
  }

  const loadingBTN= () => {
    if(isLoading === true){
      return true
    }else{
      return <ArrowUpOutlined />
    }
  }

  return (
    <Search 
      placeholder="Type your prompt and press ENTER" 
      onChange={handlePrompt}
      onSearch={onClickSendBtn}
      value={prompt}
      loading={isLoading} 
      style={{
        paddingTop: 10
      }}
      enterButton={loadingBTN()}
      disabled={isLoading}
    />
  );
}
