import { ArenaStatus } from "@/type";
import { Card, Typography, Spin } from "antd";

const { Paragraph } = Typography;

type ChatBoxProps = {
  modelName: string,
  status: ArenaStatus
  prompt?: string,
};

export default function ChatBox({ modelName, status, prompt}: ChatBoxProps) {
  function splitPrompt(prompt: string): string[] {
    return prompt.split("\n");
  }

  function textboxContent(status:ArenaStatus, prompt?: string) {
    if (prompt) {
      return <Paragraph>{
        splitPrompt(prompt).map((line: string) => {
          return (
            <div>
              <span>{line}</span><br />
            </div>
          );
        })
      }</Paragraph>
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
        height: 500,
      }}
    >
    {textboxContent(status, prompt)}
    </Card>
  );
}
