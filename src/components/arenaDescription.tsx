import { Flex, Progress, ProgressProps } from "antd";
import ReactMarkdown from "react-markdown";
export default function ArenaDescription() {
  const twoColors: ProgressProps['strokeColor'] = {
    '0%': '#108ee9',
    '100%': '#87d068',
  };

  const rules = `### 📜 Rules
  1. Connect your [AIN Wallet](https://chromewebstore.google.com/detail/ain-wallet/hbdheoebpgogdkagfojahleegjfkhkpl?hl=ko) so that you can get AIN credit for your contribution.
  2. Ask any question to two anonymous models (e.g., ChatGPT, Claude, Llama) and vote for the better one!
  3. You will be rewarded with AIN credit based on the quality of your prompt and evaluation, so please be thoughtful and thorough in your participation.`
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
      <Flex gap="small" justify="flex-start" style={{ width: 600, marginBottom: "8px" }}>
        <div style={{minWidth: 260}}><h3>💰TODAY AIN REWARD REMAIN</h3></div>
        <Progress percent={50} strokeColor={twoColors} size="small" status="active"/>
      </Flex>
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