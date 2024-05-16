"use client";

import ArenaHeader from "@/components/arenaHeader";
import { Content, Header } from "antd/lib/layout/layout";
import { RecoilRoot } from "recoil";

type RecoilRootWrapperProps = {
  children: React.ReactNode,
}

const contentStyle: React.CSSProperties = {
  textAlign: "center",
  minHeight: "80%",
  height: "80%",
};

export default function RecoilRootWrapper({ children }: RecoilRootWrapperProps) {
  return (
    <RecoilRoot>
      <ArenaHeader />
      <Content style={contentStyle}>
          {children}
      </Content>  
    </RecoilRoot>);
}