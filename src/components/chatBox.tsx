
const mockedChatAPI = async (prompt: string) => {
  const response = new Promise(
    (resolve) => {
      return setTimeout(() => resolve(prompt), 5000)
    }
  )
  return `You said '${prompt}'.`;
}

type ChatBoxProps = {
  prompt?: string,
};

export default function ChatBox({ prompt }: ChatBoxProps) {
  console.log(prompt);
  return (
    <div className="basis-1/2 border-2 border-teal-300 h-64">
      <p>{prompt ? mockedChatAPI(prompt) : ''}</p>
    </div>
  )
}