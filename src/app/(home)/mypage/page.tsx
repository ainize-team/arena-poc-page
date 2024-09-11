"use client";

import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { Spin } from "antd";

import useAuth from "@/src/lib/auth";
import useInfo from "@/src/utils/handleGetInfo";
import { LoadingOutlined } from "@ant-design/icons";
import Mypage from "@/src/containers/mypage";
import { userInfoState } from "@/src/lib/recoil";
import { UserInfo } from "@/src/types/type";

export default function Home() {
  const router = useRouter();
  const { authFetch } = useAuth();
  const { getInfo } = useInfo();

  const [recoilUserInfoState, setUserInfo] = useRecoilState(userInfoState);

  const [userInfo, setRecoilUserInfoState] = useState<Session | null>(null);

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
