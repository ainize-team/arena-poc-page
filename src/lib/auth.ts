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
      if (!session || !session.accessToken || Date.now() - session.accessToken.expire > 1000 * 60 ) {
      if (!session?.refreshToken || Date.now() - session.refreshToken.expire > 1000 * 60) {
        // NOTE(yoojin): re-login? do something. Need test but not critical because of session expired.
      } else {
        await refreshToken();
      }
    }
  }

  const refreshToken = async () => {
    const res = await fetch("/api/auth/refresh", {
      method: "POST",
    });
    const accessToken = await res.json();
    await update({ accessToken });
    console.log('refresh Date.now() :>> ', Date.now());
  }

  return {
    authFetch,
    checkAuth,
  }
}
