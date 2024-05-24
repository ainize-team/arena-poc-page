import { Card } from "antd";
import ReactMarkdown from "react-markdown";

const aboutTextboxStyle: React.CSSProperties = {
  width: "94%",
  height: "80vh",
  background: "white",
  margin: "auto",
  marginTop: "3px",
  textAlign: "left",
  borderRadius: "20px",
}

export default function About() {
  return (
    <div style={aboutTextboxStyle}>
      <ReactMarkdown>
          {`**About Us**`}
      </ReactMarkdown>
    </div>
  )
}