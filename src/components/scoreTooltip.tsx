import { Tooltip } from "antd";
import { ReactNode } from "react";
import ReactMarkdown from "react-markdown";

type ScoreTooltipProps = {
  children: ReactNode
}

export default function ScoreTooltip({children}: ScoreTooltipProps) {
  const title = "Rankings were calculated using the Elo rating system and the [Bradley-Terry (BT)](https://en.wikipedia.org/wiki/Bradley%E2%80%93Terry_model) model, employing Maximum Likelihood Estimation (MLE) for stability and bootstrap methods for confidence intervals."
  
  return (
    <Tooltip title={
      () => 
        <ReactMarkdown
          components={{
            a: ({href, children}) => <a style={{color: "cyan", textDecoration: "underline"}} href={href}>{children}</a>
          }}
        >{title}</ReactMarkdown>
    }>{children}</Tooltip>
  )
}