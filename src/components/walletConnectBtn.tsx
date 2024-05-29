"use client";

import { connectWallet } from "@/lib/wallet";
import { WalletOutlined } from "@ant-design/icons";
import { Button, Modal, Space } from "antd";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { addressAtom, useSsrCompletedState } from "@/lib/wallet";

export default function WalletConnectBtn() {
  const [noWalletModalOpen, setNoWalletModalOpen] = useState(false);
  const [invalidChainModalOpen, setInvalidChainModalOpen] = useState(false);
  const [isValidChain, setIsValidChain] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [address, setAddress] = useRecoilState(addressAtom);

  useEffect(() => {
    window.ainetwork.on("accountChanged", (event: any) => {
      const { address } = event.detail;
      setAddress(address);
    });
    window.ainetwork.on("networkChanged", (event: any) => {
      const { chainId } = event.detail;
      const validChainId = process.env.NODE_ENV === "production" ? 1 : 0;
      setIsValidChain(chainId === validChainId);
    })
  }, [])

  useEffect(() => {
    if (!isValidChain) {
      setInvalidChainModalOpen(true);
      setAddress("");
    }
    else 
      setInvalidChainModalOpen(false);
  }, [isValidChain])

  const setSsrCompleted = useSsrCompletedState();
  useEffect(setSsrCompleted, [setSsrCompleted]);

  const onClickConnectWalletBtn = async () => {
    if (address !== "") {
      setAddress("");
      return;
    }
    const res = await connectWallet();
    if (!res || res.address === undefined) {
      setNoWalletModalOpen(true);
      return;
    }
    if (res.chainId !== (process.env.NODE_ENV === "production" ? 1 : 0)) {
      setInvalidChainModalOpen(true);
      return;
    }
    setAddress(res.address);
  }

  const handleOk = () => {
    if (noWalletModalOpen)
      setNoWalletModalOpen(false);
    if (invalidChainModalOpen)
      setInvalidChainModalOpen(false);
  };

  return (
    <Space>
      <Button type={address ? "default" : "primary" } onClick={onClickConnectWalletBtn}>
        <WalletOutlined />{address ? address.slice(0,8) + "..." : "Connect Wallet"} 
      </Button>
      <Modal
        open={noWalletModalOpen}
        title="AIN Wallet not found."
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
            Install AIN Wallet
          </Button>,
        ]}
      >
        <p>To receive rewards in the Arena, you need to connect your AIN Wallet.</p>
      </Modal>
      <Modal
        open={invalidChainModalOpen}
        title="It's not valid chain. Check your wallet network."
        onOk={handleOk}
        onCancel={handleOk}
      >
        <p>Change your Wallet Network to {
        process.env.NODE_ENV === "production" ? "Mainnet" : "Testnet"
        }</p>
      </Modal>
    </Space>
  );
}
