import { useState } from "react";
import { Input } from 'antd';

const { Search } = Input;

type promptProps = {
  setParentPrompt: Function,
}

export default function PromptInsert({setParentPrompt}: promptProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePrompt = (event: any) => {
    setPrompt(event.target.value);
  }

  const onClickSendBtn = () => {
    setParentPrompt(prompt);
    setPrompt('');
  }

  return (
    <div className="flex-row my-5">
      <Search 
        placeholder="input search loading with enterButton" 
        onChange={handlePrompt}
        onSearch={onClickSendBtn}
        value={prompt}
        loading={isLoading} 
        enterButton 
      />
    </div>
  );
}