"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut } from "next-auth/react";
import { Session } from "next-auth";
import { useRecoilState } from "recoil";
import { deleteCookie } from "cookies-next";
import {
  autoPlacement,
  autoUpdate,
  flip,
  FloatingOverlay,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";

import UserProfileImage from "./userProfileImage";
import UserExpBar from "./userExpBar";
import UserBadge from "./userBadge";
import { userInfoState } from "../lib/recoil";
import { parseUserExp } from "../constant/constant";
import ThemeButtons from "./themeButtons";
import { cn } from "../utils/cn";
import onClickLoginBtn from "../utils/handleLogin";

import GoogleIcon from "@/public/images/GoogleIcon.svg";
import CloseButton from "@/public/images/buttons/CloseButton.svg";
import LogoutButton from "@/public/images/buttons/LogoutButton.svg";
import MypageButton from "@/public/images/buttons/MypageButton.svg";
import SettingButton from "@/public/images/buttons/SettingButton.svg";
import ThemeButton from "@/public/images/buttons/ThemeButton.svg";

const UserMenu = () => {
  const [recoilUserInfoState, setUserInfo] = useRecoilState(userInfoState);

  const [userInfo, setRecoilUserInfoState] = useState<Session | null>(null);
  const [userExpPercentage, setUserExpPercentage] = useState(0);
  const [isVisibleThemeButtons, setIsVisibleThemeButtons] = useState(false);
  const [isAnimatingThemeButtons, setIsAnimatingThemeButtons] = useState(false);
  const [open, setOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: open,
    onOpenChange: setOpen,
    // strategy: "fixed",
    placement: "bottom-end",
    middleware: [shift(), flip(), offset(0)],
    // whileElementsMounted: autoUpdate,
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    // useDismiss(context, {
    //   ancestorScroll: true,
    // }),
    useDismiss(context, {
      // ancestorScroll: true,
      outsidePressEvent: "mousedown",
    }),
    useRole(context),
  ]);

  useEffect(() => {
    initializeThemeButtons();
  }, [open]);

  useEffect(() => {
    setRecoilUserInfoState(recoilUserInfoState);
  }, [recoilUserInfoState]);

  useEffect(() => {
    if (!userInfo) {
      return;
    }
    const userExpPercentage = parseUserExp(
      userInfo.user.tier,
      userInfo.user.exp,
    );
    setUserExpPercentage(userExpPercentage);
  }, [userInfo]);

  const onClickLogoutBtn = async () => {
    await signOut();
    setUserInfo(null);
    deleteCookie("access_token");
    setOpen(false);
  };

  const handleThemeButtonsVisible = () => {
    setIsVisibleThemeButtons(true);
  };

  const handleThemeButtonsClose = () => {
    setIsAnimatingThemeButtons(true);
  };

  const handleThemeButtonsAnimationEnd = () => {
    if (isAnimatingThemeButtons) {
      setIsVisibleThemeButtons(false);
      setIsAnimatingThemeButtons(false);
    }
  };

  const initializeThemeButtons = () => {
    setIsVisibleThemeButtons(false);
    setIsAnimatingThemeButtons(false);
  };

  return (
    <div className="relative inline-block">
      {userInfo ? (
        <div ref={refs.setReference} {...getReferenceProps()}>
          <div className="flex items-center justify-between gap-[6px] max-desktop:hidden">
            <UserBadge userTier={userInfo.user.tier} />
            <UserExpBar
              className={"mr-1 h-[10px] w-[68px] rounded-[10px]"}
              userExpPercentage={userExpPercentage}
              barWidth={68}
            />
            <UserProfileImage
              width={32}
              height={32}
              imageUrl={userInfo.user.picture}
              onClick={() => {}}
            />
          </div>
          <div className="flex items-center justify-center gap-[10px] min-desktop:hidden">
            <UserProfileImage
              width={37}
              height={37}
              imageUrl={userInfo.user.picture}
              onClick={() => {}}
            />
          </div>
        </div>
      ) : (
        <>
          <div
            onClick={onClickLoginBtn}
            className="flex cursor-pointer items-center justify-center gap-[10px] rounded-3xl border border-light-l1 px-[14px] py-2 text-sm font-semibold leading-150 text-light-t2 max-desktop:hidden dark:border-dark-l1 dark:text-dark-t2"
          >
            <Image width={20} height={20} src={GoogleIcon} alt="googleIcon" />
            Log in with Google
          </div>
          <div ref={refs.setReference} {...getReferenceProps()}>
            <UserProfileImage
              width={37}
              height={37}
              className="cursor-pointer rounded-full border min-desktop:hidden"
              onClick={() => {}}
            />
          </div>
        </>
      )}

      {open && (
        <FloatingOverlay lockScroll style={{ background: "transparent" }}>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            //overflow-hidden
            className="relative z-popover my-6 bg-light shadow-popover lg:my-4 max-mobile:h-full max-mobile:w-full min-mobile:w-[360px] dark:shadow-popover-dark"
          >
            {isVisibleThemeButtons && (
              <ThemeButtons
                className={cn(
                  "absolute left-0 top-0 z-modal h-full w-full animate-slide-in bg-light",
                  isAnimatingThemeButtons
                    ? "animate-slide-out"
                    : "animate-slide-in",
                )}
                handleAnimationEnd={handleThemeButtonsAnimationEnd}
                handleClose={handleThemeButtonsClose}
              />
            )}
            {userInfo ? (
              <div className="flex h-[5.5rem] w-full items-center justify-between self-stretch px-4 py-6">
                <div className="flex items-center gap-3">
                  <UserProfileImage
                    width={44.5}
                    height={44.5}
                    imageUrl={userInfo.user.picture}
                    onClick={() => {}}
                    hasBadge={true}
                    badgeHeight={32}
                    badgeWidth={20}
                    userTier={userInfo.user.tier}
                    badgeClassName="bottom-[-9px] right-[-5px]"
                  />
                  <div className="flex flex-col items-start gap-2">
                    <p className="text-xl font-bold leading-120 tracking-[-0.6px] text-dark">
                      {userInfo.user.display_name}
                    </p>
                    <UserExpBar
                      className={"h-[10px] w-[200px] rounded-lg"}
                      userExpPercentage={userExpPercentage}
                      barWidth={200}
                    />
                  </div>
                </div>
                <Image
                  width={24}
                  height={24}
                  className={cn("cursor-pointer")}
                  style={{ width: 24, height: 24 }}
                  alt={"chatbot arena modal close button"}
                  src={CloseButton}
                  {...getFloatingProps({
                    onClick: () => setOpen(false),
                  })}
                />
              </div>
            ) : (
              <div className="flex h-[5.5rem] w-full items-center justify-between self-stretch px-4 py-6">
                <h1 className="text-lg font-bold leading-120 text-dark">
                  AI Network LLM Arena
                </h1>
                <Image
                  width={24}
                  height={24}
                  className={cn("cursor-pointer")}
                  alt={"chatbot arena modal close button"}
                  style={{ width: 24, height: 24 }}
                  src={CloseButton}
                  {...getFloatingProps({
                    onClick: () => setOpen(false),
                  })}
                />
              </div>
            )}
            <div className="h-[1px] w-full bg-light-b1" />
            {userInfo ? (
              <div className="flex flex-col items-center justify-center self-stretch px-4">
                <Link
                  href="/mypage"
                  className="flex items-center gap-[10px] self-stretch py-[14px]"
                  {...getFloatingProps({
                    onClick: () => setOpen(false),
                  })}
                >
                  <Image
                    width={20}
                    height={20}
                    alt={"chatbot arena llm mypage button"}
                    src={MypageButton}
                  />
                  <p className="text-base font-semibold leading-150 text-light-t2">
                    My page
                  </p>
                </Link>
                <div
                  className="flex cursor-pointer items-center gap-[10px] self-stretch py-[14px]"
                  onClick={handleThemeButtonsVisible}
                >
                  <Image
                    width={20}
                    height={20}
                    alt={"chatbot arena llm theme button"}
                    src={ThemeButton}
                  />
                  <p className="text-base font-semibold leading-150 text-light-t2">
                    Theme
                  </p>
                </div>
              </div>
            ) : (
              <></>
            )}
            <div className="flex flex-col items-start self-stretch py-4 text-base font-semibold leading-150 text-dark">
              <Link
                href="/"
                className="px-4 py-4"
                {...getFloatingProps({
                  onClick: () => setOpen(false),
                })}
              >
                Arena
              </Link>
              <Link
                href="/leaderboard"
                className="px-4 py-4"
                {...getFloatingProps({
                  onClick: () => setOpen(false),
                })}
              >
                Leaderboard
              </Link>
              <Link
                href="/about"
                className="px-4 py-4"
                {...getFloatingProps({
                  onClick: () => setOpen(false),
                })}
              >
                About
              </Link>
            </div>
            <div className="h-[1px] w-full bg-light-b1" />
            <div className="flex items-center justify-center self-stretch px-[14px] py-6">
              {userInfo ? (
                <div
                  className="flex w-full cursor-pointer items-center justify-center gap-[10px] rounded-xl border border-light-l1 p-4"
                  onClick={onClickLogoutBtn}
                >
                  <Image
                    width={20}
                    height={20}
                    alt={"chatbot arena llm logout button"}
                    src={LogoutButton}
                    style={{ width: 20, height: 20 }}
                  />
                  <p className="text-sm font-semibold leading-150 text-light-icon">
                    Logout
                  </p>
                </div>
              ) : (
                <div
                  className="flex w-full cursor-pointer items-center justify-center gap-[10px] rounded-xl border border-light-l1 p-4"
                  onClick={onClickLoginBtn}
                >
                  <p className="text-sm font-semibold leading-150 text-light-icon">
                    Log in with Google
                  </p>
                  <Image
                    width={20}
                    height={20}
                    alt={"chatbot arena llm login button"}
                    src={GoogleIcon}
                  />
                </div>
              )}
            </div>
          </div>
        </FloatingOverlay>
      )}
    </div>
  );
};

export default UserMenu;
