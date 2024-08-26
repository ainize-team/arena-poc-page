"use client";

import ArenaHeader from "@/src/components/arenaHeader";
import { Content, Header } from "antd/lib/layout/layout";
import { RecoilRoot } from "recoil";
import Navbar from "../components/Navbar";

type RecoilRootWrapperProps = {
  children: React.ReactNode;
};

const contentStyle: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "10px",
};

export default function RecoilRootWrapper({
  children,
}: RecoilRootWrapperProps) {
  return (
    <RecoilRoot>
      {/* <ArenaHeader /> */}
      <Navbar />
      <Content style={contentStyle}>{children}</Content>
    </RecoilRoot>
  );
}
