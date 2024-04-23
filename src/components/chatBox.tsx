import { Card } from "antd";

const mockedChatAPI = async (prompt: string) => {
  const response = new Promise(
    (resolve) => {
      return setTimeout(() => resolve(prompt), 5000)
    }
  )
  return `You said '${prompt}'.`;
}

type ChatBoxProps = {
  modelName: string,
  prompt?: string,
};

export default function ChatBox({ modelName, prompt }: ChatBoxProps) {
  return (
    <Card
      title={modelName}
      bordered={false}
      style={{
        width: 300,
      }}
    >
      <p>{prompt ? prompt : ''}</p>
    </Card>
  );
}