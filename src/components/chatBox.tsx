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
      return <Paragraph style={{
        height: 500 - 60, // FIXME(yoojin): change height to not constant value.
        overflow: "auto",
      }}>{
        splitPrompt(prompt).map((line: string, index: number) => {
          return (
            <div key={index}>
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
        width: "47%",
        minHeight: "60vh",
        marginLeft: "3px",
        marginRight: "3px",
      }}
    >
    {textboxContent(status, prompt)}
    </Card>
  );
}
