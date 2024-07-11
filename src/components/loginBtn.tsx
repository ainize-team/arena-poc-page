import { WalletOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginBtn () {
  const { data: session } = useSession();

  const onClickLoginBtn = async () => {
    session ? await signOut() : await signIn();
  }

  const renderLoginBtn = () => {
    return session ? 
      <Button type="default" onClick={onClickLoginBtn}>
        <WalletOutlined /> {session.user!.email}
      </Button>:
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
          headers: {
            ...(session && { Authorization: `Bearer ${session.accessToken.token}` })
          },
          body: JSON.stringify({
            modelName: "modelA",
            prompt: "prompt",
          }),
        }).then((res) => console.log(res));
      }}>test</Button>
    </Space>
  )
}