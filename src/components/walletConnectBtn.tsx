"use client";

import { requestAddress } from "@/lib/wallet";
import { WalletOutlined } from "@ant-design/icons";
import { Button, Modal, Space } from "antd";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { addressAtom, useSsrCompletedState } from "@/lib/wallet";

export default function WalletConnectBtn() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [address, setAddress] = useRecoilState(addressAtom);

  const setSsrCompleted = useSsrCompletedState();
  useEffect(setSsrCompleted, [setSsrCompleted]);

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
      <Button type={address ? "default" : "primary" } onClick={onClickConnectWalletBtn}>
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
            Install AIN wallet
          </Button>,
        ]}
      >
        <p>To receive rewards in the Arena, you need to connect your AIN Wallet.</p>
      </Modal>
    </Space>
  );
}
