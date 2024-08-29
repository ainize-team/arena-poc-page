"use client";

import Mypage from "@/src/containers/mypage";
import { userInfoState } from "@/src/lib/recoil";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

export default function Home() {
  const router = useRouter();

  const [recoilUserInfoState, setUserInfo] = useRecoilState(userInfoState);

  // TODO(yunsubae) : mypage api
  // useEffect(() => {
  //   console.log("recoilUserInfoState : ", recoilUserInfoState);
  //   if (!recoilUserInfoState) {
  //     router.push("/");
  //   }
  // }, []);

  return (
    <main className="">
      <Mypage />
    </main>
  );
}
