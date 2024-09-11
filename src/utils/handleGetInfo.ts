import { useRecoilState } from "recoil";
import { userInfoState } from "../lib/recoil";
import { UserInfo } from "../types/type";
import useAuth from "../lib/auth";

export default function useInfo() {
  const { authFetch } = useAuth();
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);

  const getInfo = async () => {
    try {
      const res = await authFetch("/api/user/info", {
        method: "GET",
      });

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

  return {
    getInfo,
  };
}
