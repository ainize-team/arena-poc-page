"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Image from "next/image";

import useWallet from "@/src/lib/wallet";
import {
  addressAtom,
  themeAtom,
  userInfoState,
  useSsrCompletedState,
} from "@/src/lib/recoil";
import { ClaimStatus } from "../types/type";
import useAuth from "../lib/auth";

import NoticeIcon from "@/public/images/buttons/NoticeIcon.svg";
import NoticeIconDark from "@/public/images/buttons/NoticeIconDark.svg";

interface WalletConnectBtnProps {
  setClaimStatus: Dispatch<SetStateAction<ClaimStatus>>;
}

export default function WalletConnectBtn({
  setClaimStatus,
}: WalletConnectBtnProps) {
  const { authFetch } = useAuth();
  const [theme, setTheme] = useRecoilState(themeAtom);
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);

  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useRecoilState<string>(addressAtom);
  const [isMobile, setIsMobile] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("light");

  const { isWalletExist, setWalletEventHandler, connectWallet, isValidChain } =
    useWallet();

  useEffect(() => {
    checkTheme(theme);
  }, [theme]);

  const checkTheme = (theme: string) => {
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      setCurrentTheme(systemTheme);
    } else {
      setCurrentTheme(theme);
    }
  };

  useEffect(() => {
    setIsMobile(/Mobi/i.test(window.navigator.userAgent));
    if (isMobile) {
      return;
    }
    setWalletEventHandler();
    if (address) setIsConnected(true);
  }, []);

  useEffect(() => {
    if (!isConnected) {
      if (address !== "") setIsConnected(true);
      return;
    }
    if (address === "") {
      setIsConnected(false);
      connectWalletAndSetConnected();
    }
  }, [address]);

  const setSsrCompleted = useSsrCompletedState();
  useEffect(setSsrCompleted, [setSsrCompleted]);

  const connectWalletAndSetConnected = async () => {
    const connectedAddress = await connectWallet();
    if (connectedAddress && connectedAddress !== "") {
      const reqBody = {
        address: connectedAddress,
      };

      const res = await authFetch("/api/user/connect/ain", {
        method: "POST",
        body: JSON.stringify(reqBody),
      });

      if (res.ok) {
        const models = await res.json();
        console.log("AIN CONNECT : ", models);
        setUserInfo((prevState) => {
          if (!prevState) return prevState;
          return {
            ...prevState,
            user: {
              ...prevState.user,
              address: connectedAddress,
            },
          };
        });
        setClaimStatus(ClaimStatus.READY);
      }
      setIsConnected(true);
    }
  };

  const onClickConnectWalletBtn = async () => {
    if (!isWalletExist()) {
      setClaimStatus(ClaimStatus.NOTINSTALLED);
      return;
    }
    if (isConnected) {
      setClaimStatus(ClaimStatus.READY);
      return;
    }
    if (!isValidChain) {
      setClaimStatus(ClaimStatus.CHECK_NETWORK);
      return;
    }
    await connectWalletAndSetConnected();
  };

  return (
    <div
      className="flex cursor-pointer items-center justify-center gap-1 self-stretch rounded-lg border border-light-l2 bg-light-b2 px-3 py-[6px] hover:bg-light-l2 dark:border-[#414358] dark:bg-dark-b4 dark:hover:bg-dark-b2"
      onClick={onClickConnectWalletBtn}
    >
      <Image
        alt="notice icon"
        width={14}
        height={14}
        src={currentTheme === "light" ? NoticeIcon : NoticeIconDark}
      />
      <p className="text-left text-sm font-medium -tracking-[0.28px] text-light-t2 dark:text-dark-t2">
        Connect AIN wallet to claim
      </p>
    </div>
  );
}
