import { Chat } from "@/types/type";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

type Props = {
  chat: Chat
}

export default function TextBox({ chat }: Props) {
  return (
    <div style={{
      marginLeft: chat.type === "user" ? "auto" : undefined,
      marginRight: chat.type !== "user" ? "auto" : undefined,
      borderRadius: "8px",
      width: "90%",
      backgroundColor: chat.type === "user" ? "#fae100" : "#999999",
      padding: "2px",
      marginTop: "10px"
    }}>
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
        {chat.text}
      </ReactMarkdown>
    </div>
  )
}