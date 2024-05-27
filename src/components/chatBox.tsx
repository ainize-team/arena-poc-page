import { ArenaStatus } from "@/type";
import { Card, Typography, Spin } from "antd";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/a11y-light.css";

const { Paragraph } = Typography;

type ChatBoxProps = {
  modelName: string,
  status: ArenaStatus
  prompt?: string,
};

export default function ChatBox({ modelName, status, prompt}: ChatBoxProps) {
  function textboxContent(status:ArenaStatus, prompt?: string) {
    if (prompt) {
      return <Paragraph style={{
        height: `${40 - 3}vh`, // FIXME(yoojin): change height to not constant value.
        overflow: "auto",
      }}>
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
          {prompt}
        </ReactMarkdown>
      </Paragraph>
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
