import { Button, Col, Row, Space } from "antd";
import { Header } from "antd/lib/layout/layout";
import WalletConnectBtn from "./walletConnectBtn";

const headerStyle: React.CSSProperties = {
  textAlign: "left",
  fontSize: "48px",
  height: 64,
  paddingInline: 48,
  lineHeight: "64px",
  backgroundColor: "#ffffff",
};

export default function ArenaHeader() {
  return (
    <Header style={headerStyle}>
      <Row>
        <Col span={22} style={{fontSize: "48px"}}>AI Network Chatbot Arena</Col>
        <Col span={2}>
          <WalletConnectBtn />
        </Col>
      </Row>
    </Header>
  );
}