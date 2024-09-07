"use client";

import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";

import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Mypage from "@/src/containers/mypage";
import { userInfoState } from "@/src/lib/recoil";
import { UserInfo } from "@/src/types/type";

export default function Home() {
  const router = useRouter();

  const [recoilUserInfoState, setUserInfo] = useRecoilState(userInfoState);

  const [userInfo, setRecoilUserInfoState] = useState<Session | null>(null);

  const getInfo = async () => {
    try {
      const res = await fetch("/api/user/info");
      const data: UserInfo = await res.json();
      setUserInfo((prevState) => {
        if (!prevState) return prevState;
        return {
          ...prevState,
          user: data,
        };
      });
    } catch (error) {}
  };

  useEffect(() => {
    setRecoilUserInfoState(recoilUserInfoState);
  }, [recoilUserInfoState]);

  useEffect(() => {
    if (!recoilUserInfoState) {
      router.push("/");
    } else {
      getInfo();
    }
  }, []);

  return (
    <main className="">
      {userInfo ? (
        <Mypage userInfo={userInfo.user} getInfo={getInfo} />
      ) : (
        <div className="flex h-[60vh] w-full items-center justify-center text-3xl font-bold dark:text-light">
          <Spin
            indicator={
              <LoadingOutlined
                style={{ fontSize: 64 }}
                className="text-dark dark:text-light"
                spin
              />
            }
          />
        </div>
      )}
    </main>
  );
}
