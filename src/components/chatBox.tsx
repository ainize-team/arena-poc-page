import { Card } from "antd";

type ChatBoxProps = {
  modelName: string,
  prompt?: string,
};

export default function ChatBox({ modelName, prompt }: ChatBoxProps) {
  return (
    <Card
      title={modelName}
      size="small"
      bordered={false}
      style={{
        width: "49.9%",
        height: 300,
      }}
    >
      <p>{prompt ? prompt : ''}</p>
    </Card>
  );
}
