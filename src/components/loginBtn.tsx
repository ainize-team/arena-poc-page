"use client";

import { WalletOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import { useSession, signIn, signOut } from "next-auth/react";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { useEffect } from "react";

export default function LoginBtn () {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.accessToken?.token) {
      console.log("set");
      // setCookie("access_token", "comcom8888");
      setCookie("access_token", session.accessToken.token);
    }
  }, [session])

  const onClickLoginBtn = async () => {
    await signIn();
  }

  const onClickLogoutBtn = async () => {
    await signOut();
    deleteCookie("access_token");
  }

  const renderLoginBtn = () => {
    return session ? 
      <Button type="default" onClick={onClickLogoutBtn}>
        <WalletOutlined /> {session.user!.email}
      </Button> :
      <Button type="primary" onClick={onClickLoginBtn}>
        <WalletOutlined /> Login with Google.
      </Button> 
  }

  return (
    <Space>
      {renderLoginBtn()}
      <Button onClick={() => {
        console.log('session.accessToken.token :>> ', session!.accessToken.token);
        fetch("/api/arena/chat", {
          method: "POST",
          body: JSON.stringify({
            modelName: "modelA",
            prompt: "prompt",
          }),
        }).then((res) => console.log(res));
      }}>test</Button>
    </Space>
  )
}