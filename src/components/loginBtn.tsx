"use client";

import Image from "next/image";
import GoogleIcon from "@/public/images/GoogleIcon.svg";
import UserProfileImage from "./userProfileImage";
import UserBadge from "./userBadge";
import UserExpBar from "./userExpBar";
import { Session } from "next-auth";

type LoginBtnProps = {
  session: Session;
  onClickLogin: Function;
};

export default function LoginBtn({ session, onClickLogin }: LoginBtnProps) {
  const renderLoginBtn = () => {
    return session ? (
      <>
        <div
          className="flex items-center justify-between gap-[6px] max-desktop:hidden"
          // onClick={onClickLogoutBtn}
        >
          {/* <Button type="default" onClick={onClickLogoutBtn}>
        <WalletOutlined /> {session.user?.display_name}
      </Button> */}
          <UserBadge userTier={session.user.tier} />
          <UserExpBar
            userExp={session.user.exp}
            className={"mr-1 h-[10px] w-[68px] rounded-[10px]"}
            expBarClassname={`h-[10px] rounded-[10px] w-[${session.user.exp * 10}]px`}
          />
          <UserProfileImage
            width={32}
            height={32}
            imageUrl={session?.user.picture}
            onClick={() => {}}
          />
        </div>
        <div
          className="min-desktop:hidden flex items-center justify-center gap-[10px]"
          // onClick={onClickLogoutBtn}
        >
          <UserProfileImage
            width={37}
            height={37}
            imageUrl={session?.user.picture}
            onClick={() => {}}
          />
        </div>
      </>
    ) : (
      <>
        <div
          onClick={() => {
            onClickLogin();
          }}
          className="flex cursor-pointer items-center justify-center gap-[10px] rounded-3xl border border-light-l1 px-[14px] py-2 text-sm font-semibold leading-150 text-light-t2 dark:border-dark-l1 dark:text-dark-t2 max-desktop:hidden"
        >
          <Image width={20} height={20} src={GoogleIcon} alt="googleIcon" /> Log
          in with Google
        </div>
        <UserProfileImage
          width={37}
          height={37}
          className="min-desktop:hidden cursor-pointer rounded-full border"
          onClick={() => {}}
        />
      </>
    );
  };

  return <>{renderLoginBtn()}</>;
}
