import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRecoilState } from "recoil";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

import Modal from "./modal";
import { modalState, themeAtom, userInfoState } from "../lib/recoil";
import { ClaimStatus, UserInfo } from "../types/type";
import { cn } from "../utils/cn";
import {
  formatAddress,
  getInsightURL,
  isDesktopBrowser,
  processNumber,
} from "../constant/constant";
import ErrorModalChildren from "./errorModalChildren";
import WalletConnectBtn from "./walletConnectBtn";
import { ClaimResponse } from "../app/api/user/claim/route";
import useAuth from "../lib/auth";

import NoticeIcon from "@/public/images/buttons/NoticeIcon.svg";
import NoticeIconDark from "@/public/images/buttons/NoticeIconDark.svg";
import ReadyStatusIcon from "@/public/images/buttons/ReadyStatusIcon.svg";
import Outlink from "@/public/images/buttons/Outlink";

interface ClaimModalProps {
  onCloseFunction: () => void;
  claimStatus: ClaimStatus;
  userInfo?: UserInfo;
  setClaimStatus: Dispatch<SetStateAction<ClaimStatus>>;
}

const defaultClaimResponseData: ClaimResponse = {
  tx_hash: "",
  amount: 0,
};

const ClaimModal = ({
  onCloseFunction,
  claimStatus,
  userInfo,
  setClaimStatus,
}: ClaimModalProps) => {
  const [theme, setTheme] = useRecoilState(themeAtom);
  const [recoilUserInfoState, setUserInfo] = useRecoilState(userInfoState);
  const { authFetch } = useAuth();

  const claimInputSpanRef = useRef<HTMLSpanElement>(null);
  const claimInputInputRef = useRef<HTMLInputElement>(null);

  const [currentTheme, setCurrentTheme] = useState("light");
  const [isClaimInputFocused, setIsClaimInputFocused] = useState(false);
  const [isClaimInputDisabled, setIsClaimInputDisabled] = useState(false);
  const [isAsyncLoading, setIsAsyncLoading] = useState(false);
  const [claimInputValue, setClaimInputValue] = useState("");
  const [transferFee, setTransferFee] = useState(1);
  const [claimInputPlaceholder, setClaimInputPlaceholder] = useState("0");
  const [isClaimableError, setIsClaimableError] = useState(false);
  const [claimResponseData, setClaimResponseData] = useState<ClaimResponse>(
    defaultClaimResponseData,
  );
  const [isModalButtonDisabled, setIsModalButtonDisabled] = useState(false);

  const initializeModal = () => {
    setClaimResponseData(defaultClaimResponseData);
    setIsClaimInputFocused(false);
    setClaimInputValue("");
    setClaimInputPlaceholder("0");
    setIsClaimableError(false);
  };

  useEffect(() => {
    checkTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (claimInputSpanRef.current && claimInputInputRef.current) {
      claimInputInputRef.current.style.width = `${Math.max(claimInputSpanRef.current.offsetWidth, 20)}px`;
    }
  }, [claimInputValue]);

  useEffect(() => {
    if (!isDesktopBrowser()) {
      return setIsModalButtonDisabled(false);
    }

    switch (claimStatus) {
      case ClaimStatus.READY:
        if (!userInfo?.address || isClaimableError || !claimInputValue) {
          setIsModalButtonDisabled(true);
        } else {
          setIsModalButtonDisabled(false);
        }
        break;
      case ClaimStatus.NOTCONNECTED:
        setIsModalButtonDisabled(true);
        break;
      default:
        setIsModalButtonDisabled(false);
        break;
    }
  }, [claimStatus, isClaimableError, userInfo, claimInputValue]);

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

  const handleClaimInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsClaimableError(false);
    const inputValue = e.target.value;

    // 숫자와 소수점만 입력 가능하게 처리
    let numericValue = inputValue.replace(/[^0-9.]/g, ""); // 숫자와 소수점 이외의 문자는 제거

    // 소수점이 여러 개 입력되지 않도록 처리
    if (numericValue.split(".").length > 2) {
      numericValue = numericValue.slice(0, numericValue.lastIndexOf("."));
    }

    // 선행 0 제거 (단, 소수점이 있는 경우는 그대로 유지, 숫자 0도 유지)
    if (numericValue !== "0" && numericValue.indexOf(".") === -1) {
      numericValue = numericValue.replace(/^0+/, ""); // 소수점이 없을 경우 선행 0 제거
    }

    // 소수점 첫째 자리까지만 허용
    const decimalIndex = numericValue.indexOf(".");
    if (decimalIndex !== -1) {
      numericValue = numericValue.slice(0, decimalIndex + 2); // 소수점 첫째 자리까지만 유지
    }

    // 소수점이 있을 경우 "0." 형식 허용
    if (numericValue === ".") {
      numericValue = "0."; // 소수점만 입력되면 0.로 변환
    }

    // 입력 값이 유저의 credit보다 크다면 에러 처리
    if (Number(numericValue) + transferFee > (userInfo?.credit ?? 0)) {
      setIsClaimableError(true);
    }

    setClaimInputValue(numericValue);
  };

  const handleClaimInputFocus = () => {
    setClaimInputPlaceholder("");
    setIsClaimInputFocused(true);
  };

  const handleClaimInputBlur = () => {
    setIsClaimInputFocused(false);
    if (!claimInputValue) {
      setClaimInputPlaceholder("0");
    }
  };

  const handleClickMax = () => {
    if (!userInfo?.credit) {
      return;
    }
    setIsClaimableError(false);
    const maxClaimable = processNumber(
      processNumber(userInfo.credit) - transferFee,
    );
    setClaimInputValue(maxClaimable.toString());
  };

  const claimAinRequest = async () => {
    if (isClaimableError) {
      return;
    }
    try {
      const reqBody = {
        amount: Number(claimInputValue),
      };

      const res = await authFetch("/api/user/claim", {
        method: "POST",
        body: JSON.stringify(reqBody),
      });

      if (res.ok) {
        const models: ClaimResponse = await res.json();
        setClaimResponseData(models);
        setClaimStatus(ClaimStatus.SUCCESS);
      } else {
        setClaimStatus(ClaimStatus.FAILURE);
      }
    } catch (error) {
      setClaimStatus(ClaimStatus.FAILURE);
    }
  };

  const discardAddress = async () => {
    const reqBody = {
      address: "",
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
            address: "",
          },
        };
      });
      setClaimStatus(ClaimStatus.NOTCONNECTED);
    }
  };

  return (
    <Modal
      onRequestClose={() => {
        onCloseFunction();
        initializeModal();
      }}
      bottomButtonText={claimStatus}
      isDisabled={isModalButtonDisabled}
      bottomButtonHandler={claimAinRequest}
      isDesktop={isDesktopBrowser()}
    >
      {claimStatus === ClaimStatus.NOTSUPPORTED ? (
        <ErrorModalChildren
          errorTitle="**Claim Not Supported on Mobile**"
          errorContentChildren={
            <div className="text-center text-sm font-normal leading-5 text-dark dark:text-light">
              <ReactMarkdown
                components={{
                  a: (props: any) => (
                    <a
                      style={{ fontWeight: 700, textDecoration: "underline" }}
                      {...props}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  ),
                }}
              >
                {`The claim feature is currently unavailable on mobile. To proceed with claiming reward, please switch to a desktop. On the desktop version, connect your Wallet to access the claim feature.`}
              </ReactMarkdown>
            </div>
          }
          errorFooterChildren
        />
      ) : claimStatus === ClaimStatus.NOTINSTALLED ? (
        <ErrorModalChildren
          errorTitle="**Any problems with AIN Wallet?**"
          errorContentChildren={
            <div className="text-center text-base font-normal text-dark dark:text-light">
              <ReactMarkdown
                components={{
                  a: (props: any) => (
                    <a
                      style={{ fontWeight: 700, textDecoration: "underline" }}
                      {...props}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  ),
                }}
              >
                {`If you do not have AIN Wallet installed yet, you can install it
                from the [Chrome Web Store](https://chromewebstore.google.com/detail/ain-wallet/hbdheoebpgogdkagfojahleegjfkhkpl?hl=ko). After installation, you will
                need to refresh the site for it to work properly.`}
              </ReactMarkdown>
            </div>
          }
          errorFooterChildren
        />
      ) : claimStatus === ClaimStatus.CHECK_NETWORK ? (
        <ErrorModalChildren
          errorTitle="**Checked your network settings**"
          errorContentChildren={
            <div className="text-center text-base font-normal text-dark dark:text-light">
              <ReactMarkdown
                components={{
                  a: (props: any) => (
                    <a
                      style={{ fontWeight: 700, textDecoration: "underline" }}
                      {...props}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  ),
                }}
              >
                {`Your wallet is currently set to the Mainnet, which disables the claim function. To proceed with claim, please switch to a supported network.`}
              </ReactMarkdown>
            </div>
          }
          errorFooterChildren
        />
      ) : claimStatus === ClaimStatus.SUCCESS ? (
        <ErrorModalChildren
          errorTitle={`**${processNumber(claimResponseData.amount)} AIN** has been transferred \nto **${formatAddress(userInfo?.address ?? "")} !**
            `}
          errorContentChildren={
            <div className="text-center text-base font-normal text-dark dark:text-light">
              <ReactMarkdown
                components={{
                  a: (props: any) => (
                    <a
                      style={{ fontWeight: 700, textDecoration: "underline" }}
                      {...props}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  ),
                }}
              >
                {`It may take some time for it to appear in your wallet.`}
              </ReactMarkdown>
            </div>
          }
          errorFooterChildren={
            <Link
              href={`${getInsightURL()}/transactions/${claimResponseData.tx_hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex cursor-pointer flex-row items-center justify-center gap-1 text-center text-base font-semibold leading-150 text-dark dark:text-light",
              )}
            >
              View transaction
              <Outlink
                strokeColor={currentTheme === "light" ? "#000" : "#fff"}
              />
            </Link>
          }
        />
      ) : claimStatus === ClaimStatus.FAILURE ? (
        <ErrorModalChildren
          errorTitle={`**Claim Failed**`}
          errorContentChildren={
            <div className="text-center text-base font-normal text-dark dark:text-light">
              <ReactMarkdown
                components={{
                  a: (props: any) => (
                    <a
                      style={{ fontWeight: 700, textDecoration: "underline" }}
                      {...props}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  ),
                }}
              >
                {`There was an issue processing your request. Please try again later.`}
              </ReactMarkdown>
            </div>
          }
          errorFooterChildren={
            <Link
              href={`${getInsightURL()}/transactions`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex cursor-pointer flex-row items-center justify-center gap-1 text-center text-base font-semibold leading-150 text-dark dark:text-light",
              )}
            >
              View transaction
              <Outlink
                strokeColor={currentTheme === "light" ? "#000" : "#fff"}
              />
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col items-start justify-center gap-5 self-stretch">
          <div className="flex flex-col items-start gap-[10px]">
            <p className="chat text-3.5xl font-bold leading-150 text-dark dark:text-light">
              Claim
            </p>
            {claimStatus === ClaimStatus.READY ? (
              <div
                className="flex cursor-pointer items-center justify-center gap-1 self-stretch rounded-lg border border-green-light-t2 bg-green-light-t3 px-3 py-[6px] hover:bg-green-light-t2 dark:border-green-dark-t3 dark:bg-green-dark-t2 dark:hover:bg-green-dark-t3"
                onClick={discardAddress}
              >
                <Image
                  alt="ready status icon"
                  width={14}
                  height={14}
                  src={ReadyStatusIcon}
                />
                <p className="text-left text-sm font-bold -tracking-[0.28px] text-green-light dark:text-green-dark">
                  Connected
                </p>
                <p className="text-left text-sm font-normal -tracking-[0.28px] text-green-light dark:text-green-dark">
                  {formatAddress(userInfo?.address ?? "")}
                </p>
              </div>
            ) : (
              <WalletConnectBtn setClaimStatus={setClaimStatus} />
            )}
          </div>
          <div className="flex flex-col items-start gap-6 self-stretch pb-10">
            <div className="flex items-center gap-2 self-stretch pr-4">
              <div className="flex flex-[1_0_0%] items-center text-base font-medium leading-5 text-dark dark:text-light">
                Claimable Rewards
              </div>
              <p className="chat text-xl font-bold leading-150 text-dark dark:text-light">
                {processNumber(userInfo?.credit ?? 0)} AIN
              </p>
            </div>
            <div className="flex w-full flex-col gap-3">
              <div className="flex items-center justify-between self-stretch">
                <div className="flex h-5 items-center justify-center text-base font-medium leading-5 text-dark dark:text-light">
                  Rewards to be claimed
                </div>
                <div
                  className={cn(
                    "flex max-w-[300px] flex-[1_0_0%] cursor-text items-center justify-end self-stretch rounded-lg border-[1.5px] px-4 py-3",
                    isClaimInputFocused
                      ? "border-primary-violet2 dark:border-primary"
                      : "border-light-l1 dark:border-dark-l2",
                    isClaimableError &&
                      "border-light-tier4Text dark:border-dark-tier4DarkText",
                  )}
                  onClick={() => {
                    claimInputInputRef.current?.focus();
                  }}
                >
                  <div className="flex max-w-full items-center justify-end">
                    <span className="chat text-xl font-bold leading-150 text-dark dark:text-light">
                      -
                    </span>
                    <div className="relative flex max-w-[220px] items-center">
                      <input
                        type="text"
                        value={claimInputValue}
                        onChange={handleClaimInputChange}
                        onFocus={handleClaimInputFocus}
                        onBlur={handleClaimInputBlur}
                        className="chat ml-1 mr-1 bg-transparent text-center text-xl font-bold leading-150 text-dark outline-none dark:text-light"
                        placeholder={claimInputPlaceholder}
                        inputMode="numeric"
                        ref={claimInputInputRef}
                        style={{ minWidth: "20px", width: "20px" }}
                      />
                      <span
                        ref={claimInputSpanRef}
                        className="chat invisible absolute whitespace-pre text-xl font-bold leading-150 text-dark dark:text-light"
                      >
                        {claimInputValue || claimInputPlaceholder}
                      </span>
                    </div>
                    <span className="chat text-xl font-bold leading-150 text-light-t2">
                      AIN
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="chat flex cursor-pointer items-center justify-center self-end rounded-md bg-light-b1 px-3 py-1 text-sm font-bold leading-130 text-dark hover:bg-light-l1 dark:bg-dark-b2 dark:text-light hover:dark:bg-dark-b1"
                onClick={handleClickMax}
              >
                MAX
              </div>
            </div>
            <div className="flex items-center gap-2 self-stretch pr-4">
              <div className="flex flex-[1_0_0%] items-center text-base font-medium leading-5 text-dark dark:text-light">
                Estimated Gas Fee
              </div>
              <p className="chat text-xl font-bold leading-150 text-light-t2">
                - {transferFee} AIN
              </p>
            </div>
            <div className="h-[1.5px] w-full bg-light-l1 dark:bg-dark-l2" />
            <div className="flex items-center gap-2 self-stretch pr-4">
              <div className="flex flex-[1_0_0%] items-center text-base font-medium leading-5 text-dark dark:text-light">
                Remaining Rewards
              </div>
              <p className="chat text-xl font-bold leading-150 text-dark dark:text-light">
                {processNumber(
                  (userInfo?.credit ?? 0) -
                    (transferFee + Number(claimInputValue)),
                )}{" "}
                AIN
              </p>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ClaimModal;
