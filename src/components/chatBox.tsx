import { ArenaStatus } from "@/type";
import { Card, Typography, Spin } from "antd";

const { Paragraph } = Typography;

type ChatBoxProps = {
  modelName: string,
  status: ArenaStatus
  prompt?: string,
};

export default function ChatBox({ modelName,status,prompt}: ChatBoxProps) {
  function textboxContent(status:ArenaStatus, prompt?: string) {
    if(prompt) {
      return <Paragraph>{prompt}</Paragraph>
    } else if (status == ArenaStatus.INFERENCING ) {
      return <Spin tip="Loading" size="large"/>
    }
  }

  return (
    <Card
      title={modelName}
      size="small"
      bordered={false}
      style={{
        textAlign: "left",
        width: "49.9%",
        minHeight: "60vh",
      }}
    >
    {textboxContent(status,prompt)}
    </Card>
  );
}
