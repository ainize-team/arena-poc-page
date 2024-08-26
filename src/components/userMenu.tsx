"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { Session } from "next-auth";
import { useRecoilState } from "recoil";
import { deleteCookie, getCookies, setCookie } from "cookies-next";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import UserProfileImage from "./userProfileImage";
import UserExpBar from "./userExpBar";
import UserBadge from "./userBadge";
import { cn } from "../utils/cn";

import GoogleIcon from "@/public/images/GoogleIcon.svg";
import CloseButton from "@/public/images/buttons/CloseButton.svg";
import LogoutButton from "@/public/images/buttons/LogoutButton.svg";
import MypageButton from "@/public/images/buttons/MypageButton.svg";
import SettingButton from "@/public/images/buttons/SettingButton.svg";
import { userInfoState } from "../lib/recoil";

const UserMenu = () => {
  const [userInfo, setRecoilUserInfoState] = useState<Session | null>(null);
  const [recoilUserInfoState, setUserInfo] = useRecoilState(userInfoState);

  useEffect(() => {
    setRecoilUserInfoState(recoilUserInfoState);
  }, [recoilUserInfoState]);

  const onClickLoginBtn = async () => {
    await signIn();
  };

  const onClickLogoutBtn = async () => {
    await signOut();
    setUserInfo(null);
    deleteCookie("access_token");
  };

  const [open, setOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: open,
    onOpenChange: setOpen,
    strategy: "fixed",
    placement: "bottom-end",
    middleware: [shift(), flip(), offset(0)],
    whileElementsMounted: autoUpdate,
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useDismiss(context, {
      ancestorScroll: true,
    }),
  ]);

  return (
    <div className="relative inline-block">
      <div className="">
        {userInfo ? (
          <div ref={refs.setReference} {...getReferenceProps()}>
            <div className="flex items-center justify-between gap-[6px] max-desktop:hidden">
              <UserBadge userTier={userInfo.user.tier} />
              <UserExpBar
                userExp={userInfo.user.exp}
                className={"mr-1 h-[10px] w-[68px] rounded-[10px]"}
                expBarClassname={`h-[10px] rounded-[10px] w-[10]px`}
              />
              <UserProfileImage
                width={32}
                height={32}
                imageUrl={userInfo.user.picture}
                onClick={() => {}}
              />
            </div>
            <div className="min-desktop:hidden flex items-center justify-center gap-[10px]">
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
              className="flex cursor-pointer items-center justify-center gap-[10px] rounded-3xl border border-light-l1 px-[14px] py-2 text-sm font-semibold leading-150 text-light-t2 dark:border-dark-l1 dark:text-dark-t2 max-desktop:hidden"
            >
              <Image width={20} height={20} src={GoogleIcon} alt="googleIcon" />
              Log in with Google
            </div>
            <div ref={refs.setReference} {...getReferenceProps()}>
              <UserProfileImage
                width={37}
                height={37}
                className="min-desktop:hidden cursor-pointer rounded-full border"
                onClick={() => {}}
              />
            </div>
          </>
        )}

        {open && (
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className="shadow-popover min-mobile:w-[360px] max-mobile:w-full max-mobile:h-full z-popover my-6 overflow-hidden bg-light lg:my-4"
          >
            {userInfo ? (
              <div className="flex w-full items-center justify-between self-stretch px-4 py-6">
                <div className="flex items-center gap-3">
                  <UserProfileImage
                    width={44.5}
                    height={44.5}
                    imageUrl={userInfo.user.picture}
                    onClick={() => {}}
                    hasBadge={true}
                    badgeHeight={22}
                    badgeWidth={14}
                    userTier={userInfo.user.tier}
                    badgeClassName="bottom-[-2px] right-[-2px]"
                  />
                  <div className="flex flex-col items-start gap-2">
                    <p className="text-xl font-bold leading-120 tracking-[-0.6px] text-dark">
                      {userInfo.user.display_name}
                    </p>
                    <UserExpBar
                      userExp={userInfo.user.exp}
                      className={"h-[10px] w-[200px] rounded-[10px]"}
                      expBarClassname={`rounded-[10px] w-[${100}px]`}
                    />
                  </div>
                </div>
                <Image
                  width={24}
                  height={24}
                  className={cn("cursor-pointer")}
                  alt={"modal close button"}
                  src={CloseButton}
                  {...getFloatingProps({
                    onClick: () => setOpen(false),
                  })}
                />
              </div>
            ) : (
              <div className="flex w-full items-center justify-between self-stretch px-4 py-6">
                <p className="text-lg font-bold leading-120 text-dark">
                  AI Network LLM Arena
                </p>
                <Image
                  width={24}
                  height={24}
                  className={cn("cursor-pointer")}
                  alt={"modal close button"}
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
                    alt={"mypage button"}
                    src={MypageButton}
                  />
                  <p className="text-base font-semibold leading-150 text-light-t2">
                    My page
                  </p>
                </Link>
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
                    alt={"setting button"}
                    src={SettingButton}
                  />
                  <p className="text-base font-semibold leading-150 text-light-t2">
                    Settings
                  </p>
                </Link>
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
                href="/mypage"
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
                    alt={"logout button"}
                    src={LogoutButton}
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
                    alt={"login button"}
                    src={GoogleIcon}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMenu;
