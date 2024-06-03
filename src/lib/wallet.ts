import { useRecoilState } from "recoil";
import { addressAtom } from "./recoil";
import { useEffect, useState } from "react";
import { env } from "../constant/constant";


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
      const validChain = process.env.NODE_ENV === "production" ? 1 : 0;
      console.log('_address :>> ', _address);
      setWalletAddress(_address);
      setIsValidChain(validChain === chainId);
    }
    getWalletInfo();
  }, [])

  useEffect(() => {
    setAddress("");
  }, [walletAddress])

  const setWalletEventHandler = () => {
    window.ainetwork.on("accountChanged", (event: any) => {
      const _address = event.detail.address;
      if (address === _address) return;
      setWalletAddress(_address);
      setAddress("");
    });
    window.ainetwork.on("networkChanged", (event: any) => {
      const { chainId } = event.detail;
      console.log('env :>> ', env);
      const validChainId = env.NODE_ENV === "production" ? 1 : 0;
      setIsValidChain(chainId === validChainId);
    })
  };

  const connectWallet = async () => {
    const walletExtension = window.ainetwork;
    if (walletExtension) {
      await walletExtension.signMessage("test");
      try {
        console.log('walletAddress :>> ', walletAddress);
        setAddress(walletAddress);
        console.log('address :>> ', address);
      } catch (error) {
        console.log('Why cant catch~~ ');
        setAddress("");
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
