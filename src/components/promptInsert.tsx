import { useState } from "react";

type promptProps = {
  setParentPrompt: Function,
}

export default function PromptInsert({setParentPrompt}: promptProps) {
  const [prompt, setPrompt] = useState('');

  const handlePrompt = (event: any) => {
    console.log('handlePrompt :>> ', event.target.value);
    setPrompt(event.target.value);
  }

  const onClickSendBtn = () => {
    setParentPrompt(prompt);
    setPrompt('');
  }

  return (
    <div className="flex-row my-5 border-2 border-teal-300">
      <input className='w-11/12' onChange={handlePrompt} value={prompt}></input>
      <button className='w-1/12 primary' type='button' onClick={onClickSendBtn}>enter</button>
    </div>
  );
}