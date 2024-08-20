"use client";

import { useState } from "react";

type UserInfo = {
  address: string,
  credit: number,
  display_name: string,
  picture: string,
  tier: number
};

export default function Mypage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const getInfoAPITest = async () => {
    const res = await fetch("/api/user/info");
    const data = await res.json();
    setUserInfo(data);
  }

  return (
    <>
      {
        userInfo !== null ? 
          <div>
            {JSON.stringify(userInfo)}
          </div> :
          <button onClick={() => getInfoAPITest()}>test</button>
      }
    </>
  );
}
