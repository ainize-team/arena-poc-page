"use client";

import React, { useState } from "react";
import ReactModal from "react-modal";
import { useRecoilState } from "recoil";
import Image from "next/image";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import { modalState } from "../lib/recoil";
import { cn } from "../utils/cn";
import { ClaimStatus } from "../types/type";

import CloseIcon from "@/public/images/buttons/CloseIcon.svg";
import GoogleIcon from "@/public/images/GoogleIcon.svg";

interface ModalProps {
  children: React.ReactNode;
  onRequestClose: () => void;
  isAsyncLoading?: boolean;
  modalTitle?: string;
  bottomButtonText?: string;
  modalWidth?: number;
  isDisabled?: boolean;
  bottomButtonHandler?: () => Promise<void>;
  isDesktop?: boolean;
  isAuthModal?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  children,
  onRequestClose,
  isAsyncLoading = false,
  modalTitle = "",
  bottomButtonText = "Ok",
  modalWidth = 600,
  isDisabled = false,
  bottomButtonHandler,
  isDesktop = true,
  isAuthModal = false,
}) => {
  const customModalStyles: ReactModal.Styles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      width: "100%",
      height: "100vh",
      zIndex: 9998,
      position: "fixed",
      top: 0,
      left: 0,
    },
    content: {
      width: isDesktop ? modalWidth : "90%",
      outline: "2px solid transparent",
      outlineOffset: "2px",
    },
  };

  const [isOpen, setIsOpen] = useRecoilState(modalState);

  const [asyncLoading, setAsyncLoading] = useState(false);

  const handleClickBottomButton = async (bottomButtonText: string) => {
    if (
      bottomButtonText === ClaimStatus.NOTCONNECTED ||
      bottomButtonText === ClaimStatus.READY
    ) {
      if (!isDisabled && bottomButtonHandler) {
        setAsyncLoading(true);
        await bottomButtonHandler();
        setAsyncLoading(false);
      }
    } else {
      closeModal();
    }
  };

  const closeModal = () => {
    if (asyncLoading) {
      return;
    }
    onRequestClose();
  };

  return (
    <ReactModal
      isOpen={isOpen}
      style={customModalStyles} // 스타일 적용
      onRequestClose={closeModal} // 모달 창 닫기 요청을 받을 때 호출
      shouldCloseOnOverlayClick={isAuthModal ? true : false} // 외부 클릭으로 모달 닫기 활성화
      appElement={document.querySelector("main") || undefined}
      className={cn(
        "absolute left-1/2 top-1/2 z-over h-fit w-fit -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-2xl bg-light shadow-sm outline-none max-desktop:px-4 max-desktop:py-4 min-desktop:p-8 dark:bg-dark-b3",
      )}
      onAfterOpen={() => (document.body.style.overflow = "hidden")}
      onAfterClose={() => (document.body.style.overflow = "unset")}
    >
      <div
        className={cn(
          "relative w-full outline-none max-desktop:px-4 min-desktop:px-0",
          isAuthModal && "max-desktop:px-0",
        )}
      >
        {!isAuthModal && (
          <div
            onClick={closeModal}
            className="absolute right-0 top-0 cursor-pointer outline-none"
          >
            <Image
              width={isDesktop ? 36 : 26}
              height={isDesktop ? 36 : 26}
              className={cn("max-desktop:p-[6px] min-desktop:p-[7.5px]")}
              alt={"modal close button"}
              style={{
                width: isDesktop ? 36 : 26,
                height: isDesktop ? 36 : 26,
              }}
              src={CloseIcon}
            />
          </div>
        )}

        {children}

        {isAuthModal ? (
          <div
            onClick={async () => {
              closeModal();
              await bottomButtonHandler!();
            }}
            className={cn(
              "flex w-full cursor-pointer items-center justify-center self-stretch border-light-l1 max-desktop:h-12 max-desktop:gap-2 max-desktop:rounded-lg max-desktop:border max-desktop:px-2 max-desktop:py-1 min-desktop:h-20 min-desktop:gap-4 min-desktop:rounded-xl min-desktop:border-2 min-desktop:px-[14px] min-desktop:py-2 dark:border-dark-l2",
            )}
          >
            <p className="font-semibold leading-150 text-dark max-desktop:text-xs min-desktop:text-base dark:text-light">
              Log in with Google
            </p>
            <Image
              alt={"login button"}
              src={GoogleIcon}
              className="max-desktop:h-[14px] max-desktop:w-[14px] min-desktop:h-6 min-desktop:w-6"
            />
          </div>
        ) : (
          <button
            onClick={() => {
              handleClickBottomButton(bottomButtonText);
            }}
            className={cn(
              "flex w-full flex-row items-center justify-center gap-2 self-stretch rounded-xl bg-dark px-5 py-3 text-base font-bold leading-5 text-light disabled:cursor-not-allowed disabled:opacity-50 dark:bg-light dark:text-dark",
            )}
            disabled={isDisabled || isAsyncLoading}
          >
            {asyncLoading ? (
              <Spin
                indicator={
                  <LoadingOutlined
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                    }}
                    className="text-light dark:text-dark"
                    spin
                  />
                }
              />
            ) : (
              <></>
            )}
            {bottomButtonText === ClaimStatus.NOTCONNECTED ||
            bottomButtonText === ClaimStatus.READY
              ? "Claim"
              : "OK"}
          </button>
        )}
      </div>
    </ReactModal>
  );
};

export default Modal;
