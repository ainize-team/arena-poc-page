"use client";

import { Content } from "antd/lib/layout/layout";
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
      <header className="px-4 py-6 lg:px-10 lg:py-4">
        <div className="py-2">&nbsp;</div>
      </header>
      <div style={contentStyle} className="mt-6">
        {children}
      </div>
    </RecoilRoot>
  );
}
