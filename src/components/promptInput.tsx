"use client";

import { useState } from "react";
import { Input } from 'antd';
import chat from "@/app/api/chat";

const { Search } = Input;

type promptProps = {
  setParentPrompt: Function,
}

export default function PromptInput({setParentPrompt}: promptProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePrompt = (event: any) => {
    setPrompt(event.target.value);
  }

  const onClickSendBtn = () => {
    const response = chat({ path: '/mock', params: { prompt } });
    setParentPrompt(response);
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
    />
  );
}
