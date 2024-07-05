import ReactMarkdown from "react-markdown";

export default function ArenaDescription() {
  const rules = `### 📜 Rules
  1. Connect your [AIN Wallet](https://chromewebstore.google.com/detail/ain-wallet/hbdheoebpgogdkagfojahleegjfkhkpl?hl=ko).
  2. Ask any question to two anonymous models (e.g., ChatGPT, Claude, Llama) and vote for the better one!`
  const chatNow = `### 👇 Chat now!`
  return (
    <div style={{
      background: "#ffffff",
      textAlign: "left",
      paddingTop: "12px",
      paddingBottom: "12px",
      paddingInline: "3rem",
      lineHeight: 1.5,
    }}>
      <ReactMarkdown components={{
        a: (props: any) => (
          <a style={{color: "blue"}} {...props} />
        )
      }}>
        {rules}
      </ReactMarkdown>
      <div style={{marginTop: "8px"}}>
        <ReactMarkdown>
          {chatNow}
        </ReactMarkdown>
      </div>
    </div>
  );
}