"use client";

import useWallet  from "@/lib/wallet";
import { WalletOutlined } from "@ant-design/icons";
import { Button, Modal, Space, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { addressAtom, useSsrCompletedState } from "@/lib/recoil";
import { useRecoilState } from "recoil";
import { PUBLIC_ENV } from "../constant/constant";

export default function WalletConnectBtn() {
  const [isConnected, setIsConnected] = useState(false);
  const [noWalletModalOpen, setNoWalletModalOpen] = useState(false);
  const [invalidChainModalOpen, setInvalidChainModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [address, setAddress] = useRecoilState<string>(addressAtom);
  const [isMobile, setIsMobile] = useState(false);
  const {
    isWalletExist,
    setWalletEventHandler,
    connectWallet, 
    isValidChain 
  } = useWallet();

  useEffect(() => {
    setIsMobile(/Mobi/i.test(window.navigator.userAgent));
    if (isMobile) {
      return;
    }
    setWalletEventHandler();
    if (address) setIsConnected(true);
  }, []);

  useEffect(() => {
    if (!isValidChain) {
      setInvalidChainModalOpen(true);
    }
    else 
      setInvalidChainModalOpen(false);
  }, [isValidChain])

  useEffect(() => {
    if (!isConnected) {
      if (address !== "")
        setIsConnected(true);
      return;
    }
    if (address === "") {
      setIsConnected(false);
      connectWalletAndSetConnected();
    }
  }, [address])

  const setSsrCompleted = useSsrCompletedState();
  useEffect(setSsrCompleted, [setSsrCompleted]);

  const connectWalletAndSetConnected = async () => {
    await connectWallet();
    setIsConnected(true);
  }

  const onClickConnectWalletBtn = async () => {
    if (!isWalletExist()) {
      setNoWalletModalOpen(true);
      return;
    }
    if (isConnected) {
      setIsConnected(false);
      setAddress("");
      return;
    }
    if (!isValidChain) {
      return;
    }
    await connectWalletAndSetConnected();
  }

  const handleOk = () => {
    if (noWalletModalOpen)
      setNoWalletModalOpen(false);
    if (invalidChainModalOpen)
      setInvalidChainModalOpen(false);
  };

  const renderWalletButton = () => {
    let text = "Connect Wallet";
    if (isConnected)
      text = address.slice(0,8) + "...";

    if (invalidChainModalOpen) {
      return (
        <Tooltip title={`Unsupported network (${PUBLIC_ENV.APP_ENV!=="production" ? "Mainnet" : "Testnet"}).`} placement="bottom" open>{text}</Tooltip>
      )
    }
    return text;
  }

  return (
    <Space>
      {!isMobile ? (
      <>
      <Button type={isConnected ? "default" : "primary" } onClick={onClickConnectWalletBtn}>
        <WalletOutlined />{renderWalletButton()} 
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
      </>) : <></>}
    </Space>
  );
}
