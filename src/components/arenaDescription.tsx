import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

export default function ArenaDescription() {
  const prompt = `### 📜 Rules
  1. Connect your [AIN Wallet](https://chromewebstore.google.com/detail/ain-wallet/hbdheoebpgogdkagfojahleegjfkhkpl?hl=ko) so that you can get AIN credit for your contribution.
  2. Ask any question to two anonymous models (e.g., ChatGPT, Claude, Llama) and vote for the better one!
  3. You will be rewarded with AIN credit based on the quality of your prompt and evaluation, so please be thoughtful and thorough in your participation.
### 👇 Chat now!`
  return (
    <div style={{
      background: "#ffffff",
      textAlign: "left",
      paddingTop: "12px",
      paddingBottom: "12px",
      paddingInline: "2rem",
      lineHeight: 1.5,
    }}>
      <ReactMarkdown components={{
        a: (props: any) => (
          <a style={{color: "blue"}} {...props} />
        )
      }}>
        {prompt}
      </ReactMarkdown>
    </div>
  );
}