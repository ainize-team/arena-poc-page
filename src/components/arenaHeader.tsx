import { Header } from "antd/lib/layout/layout";
import WalletConnectBtn from "./walletConnectBtn";

const headerStyle: React.CSSProperties = {
  textAlign: "left",
  display: "flex",
  height: 64,
  paddingInline: "3rem",
  paddingTop: "8px",
  lineHeight: "64px",
  backgroundColor: "#ffffff",
};

export default function ArenaHeader() {
  return (
    <Header style={headerStyle}>
      <div style={{
        flex: "none",
        fontSize: "32px",
        fontWeight: "bold",
        }}>AI Network LLM Arena</div>
      <div style={{
        marginLeft: "auto",
      }}>
        <WalletConnectBtn />
      </div>
    </Header>
  );
}