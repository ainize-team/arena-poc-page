"use client";

import { Content, Header } from "antd/lib/layout/layout";
import { RecoilRoot } from "recoil";

type RecoilRootWrapperProps = {
  children: React.ReactNode,
}

const headerStyle: React.CSSProperties = {
  textAlign: "center",
  fontSize: "48px",
  height: 64,
  paddingInline: 48,
  lineHeight: "64px",
  backgroundColor: "#ffffff",
};

const contentStyle: React.CSSProperties = {
  textAlign: "center",
  minHeight: "80%",
  height: "80%",
};

export default function RecoilRootWrapper({ children }: RecoilRootWrapperProps) {
  return (
    <RecoilRoot>
      <Header style={headerStyle}>AI Network Chatbot Arena</Header>
      <Content style={contentStyle}>
          {children}
      </Content>  
    </RecoilRoot>);
}