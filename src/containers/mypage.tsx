"use client";

import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { userInfoState } from "../lib/recoil";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import InProgressBox from "../components/inProgressBox";

type UserInfo = {
  address: string;
  credit: number;
  display_name: string;
  picture: string;
  tier: number;
};

export default function Mypage() {
  const router = useRouter();
  const [recoilUserInfoState, setUserInfo] = useRecoilState(userInfoState);

  const [userInfo, setRecoilUserInfoState] = useState<Session | null>(null);
  const [userMypageInfo, setMypageUserInfo] = useState<UserInfo | null>(null);

  const getInfoAPI = async () => {
    const res = await fetch("/api/user/info");
    const data = await res.json();
    setMypageUserInfo(data);
  };

  useEffect(() => {
    setRecoilUserInfoState(recoilUserInfoState);
  }, [recoilUserInfoState]);

  useEffect(() => {
    if (userInfo) {
      getInfoAPI();
    }
  }, []);

  return (
    // <div>{JSON.stringify(userInfo)}</div>
    // TODO(yunsubae) : mypage ui
    //  {userInfo !== null ? (
    //         <div className="h-[80vh] border text-2xl font-bold flex items-center justify-center">This page will be updated soon!</div>
    //       ) : (
    //         <div className="h-[80vh] border">This page will be updated soon!</div>
    //       )}
    <InProgressBox />
  );
}
