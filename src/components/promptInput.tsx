"use client";

import { useState } from "react";
import { Input } from 'antd';
import { chat } from "@/app/api/chat";

const { Search } = Input;

type promptProps = {
  setParentPrompt: Function,
  disabled?: boolean
}

export default function PromptInput({setParentPrompt, disabled = false}: promptProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePrompt = (event: any) => {
    setPrompt(event.target.value);
  }

  const onClickSendBtn = async() => {
    setParentPrompt(prompt);
    setPrompt('');
  }

  return (
    <Search 
      placeholder="input search loading with enterButton" 
      onChange={handlePrompt}
      onSearch={onClickSendBtn}
      value={prompt}
      loading={isLoading} 
      style={{
        paddingTop: 10
      }}
      enterButton
      disabled={disabled}
    />
  );
}
