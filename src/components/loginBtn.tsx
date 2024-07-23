"use client";

import { WalletOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import { useSession, signIn, signOut } from "next-auth/react";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { useEffect } from "react";
import { checkCookies } from "@/lib/auth";

export default function LoginBtn () {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.accessToken) {
      console.log('getCookies :>> ', getCookie("access_token"));
      console.log('accessToken :>> ', session.accessToken);
      setCookie("access_token", session.accessToken.token, {
        expires: new Date(session.accessToken.expire)
      });
    }
    if (session?.refreshToken) {
      setCookie("refresh_token", session.refreshToken.token, {
        expires: new Date(session.refreshToken.expire)
      })
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
    </Space>
  )
}