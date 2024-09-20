import { getCookie, getCookies, setCookie } from "cookies-next";
import { useSession } from "next-auth/react";

export default function useAuth() {
  const { data: session, update } = useSession();

  const authFetch = async (
    url: string | URL,
    requestInit: RequestInit,
  ) => {
    await checkAuth();
    return fetch(url, requestInit);
  }

  const checkAuth = async () => {
    if (!session) {
      // need login action?
      return;
    }
    const { access_token: accessToken, refresh_token: refreshToken } = getCookies();
    if (!accessToken) {
      if (!refreshToken) {
        // NOTE(yoojin): re-login? do something. Need test but not critical because of session expired.
      } else {
        await refreshAccessToken();
      }
    }
  }

  const refreshAccessToken = async () => {
    const res = await fetch("/api/auth/refresh", {
      method: "GET",
    });
    const accessToken = await res.json();
    await update({ accessToken });
    setCookie("access_token", accessToken.token, {
      expires: new Date(accessToken.expire),
    });
  }

  return {
    authFetch,
    checkAuth,
  }
}
