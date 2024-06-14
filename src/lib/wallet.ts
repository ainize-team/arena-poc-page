import { useRecoilState } from "recoil";
import { addressAtom } from "./recoil";
import { useEffect, useState } from "react";
import { PUBLIC_ENV } from "../constant/constant";


export default function useWallet() {
  const [walletAddress, setWalletAddress] = useState("");
  const [address, setAddress] = useRecoilState(addressAtom);
  const [isValidChain, setIsValidChain] = useState(true);

  const isWalletExist = (): boolean => {
    if (window.ainetwork) return true;
    return false;
  }

  useEffect(() => {
    const walletExtension = window.ainetwork;
    if (!walletExtension) {
      setWalletAddress("");
      return;
    }
    const getWalletInfo = async () => {
      const _address = await walletExtension.getAddress();
      const _chain = await walletExtension.getNetwork();
      const chainId = _chain.chainId;
      const validChain = PUBLIC_ENV.APP_ENV === "production" ? 1 : 0;
      setWalletAddress(_address);
      setIsValidChain(validChain === chainId);
    }
    getWalletInfo();
  }, [])

  useEffect(() => {
    // NOTE(yoojin): 페이지 이동시 walletAddress 가 empty로 변경되어 호출됨.
    if (!walletAddress || address === walletAddress) return;
    setAddress("");
  }, [walletAddress])

  const setWalletEventHandler = () => {
    const walletExtension = window.ainetwork;
    if (!walletExtension) return;
    walletExtension.on("accountChanged", (event: any) => {
      const _address = event.detail.address;
      if (address === _address) return;
      setWalletAddress(_address);
      setAddress("");
    });
    walletExtension.on("networkChanged", (event: any) => {
      const { chainId } = event.detail;
      const validChainId = PUBLIC_ENV.APP_ENV === "production" ? 1 : 0;
      setIsValidChain(chainId === validChainId);
    })
  };

  const connectWallet = async () => {
    const walletExtension = window.ainetwork;
    if (walletExtension) {
      const date = new Date();
      const signMessage = `arena.ainetwork.ai wants you to sign in with your AI Network account: ${walletAddress}\
        Please sign-in to use the arena. This is only for login in purposes, it does not cost any gas and does not send any funds.\
        Issued At: ${date.toDateString()}`
      await walletExtension.signMessage(signMessage);
      try {
        setAddress(walletAddress);
      } catch (error) {
        setAddress("");
      }
      try {
        const res = await fetch(`/api/eventDrop/${walletAddress}`);
      } catch (error) {
        return;
      }
    } else {
      setAddress("");
    }
  };

  const handleChangedAddress = (_address: string) => {
    setAddress(_address);
  }

  return {
    isWalletExist,
    connectWallet,
    isValidChain,
    handleChangedAddress,
    setAddress,
    setWalletEventHandler,
  };
}
