import { getCookies, setCookie } from "cookies-next";
import { signIn } from "next-auth/react";

export const authFetch = async (url: string | URL, requestInit: RequestInit) => {
  // await checkCookies();
  return fetch(url, requestInit);
}

const refreshToken = async () => {
  const res = await fetch("/api/auth/refresh", {
    method: "POST"
  });
  const accessToken = await res.json();
  if (!accessToken.token) {
    throw new Error("Failed to fetch jwt.");
  }
  setCookie("access_token", accessToken.token, {
    expires: accessToken.expire
  })
  return accessToken.token;
}

export const checkCookies = async () => {
  const {access_token, refresh_token} = getCookies();
  if (!access_token) {
    if (!refresh_token) {
      await signIn();
    } else {
      await refreshToken();
    }
  }
}
