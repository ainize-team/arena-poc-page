"use client";

import { requestAddress } from "@/lib/wallet";
import { WalletOutlined } from "@ant-design/icons";
import { Button, Modal, Space } from "antd";
import { useState } from "react";

export default function WalletConnectBtn() {
  const [address, setAddress] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const onClickConnectWalletBtn = async () => {
    if(address !== "") {
      return;
    }
    const getAddress = await requestAddress();
    if(getAddress === undefined){
      setModalOpen(true);
      return;
    }
    setAddress(getAddress);
  }

  const handleOk = () => {
    setModalOpen(false);
  };

  return (
    <Space>
      <Button onClick={onClickConnectWalletBtn}>
        <WalletOutlined />{address ? address.slice(0,8)+"..." : "connect wallet"} 
      </Button>
      <Modal
        open={modalOpen}
        title="Ain Wallet not found"
        onOk={handleOk}
        onCancel={handleOk}
        footer={[
          <Button
            key="link"
            href="https://chromewebstore.google.com/detail/ain-wallet/hbdheoebpgogdkagfojahleegjfkhkpl?hl=ko"
            type="primary"
            loading={modalLoading}
            onClick={handleOk}
          >
            Install AIN wallet extention
          </Button>,
        ]}
      >
        <p>You should install AIN wallet first.</p>
      </Modal>
    </Space>
  );
}
