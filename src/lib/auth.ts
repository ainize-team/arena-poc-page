import { getCookies, setCookie } from "cookies-next";

export const authFetch = async (url: string | URL, requestInit: RequestInit) => {
  console.log('getCookies() :>> ', getCookies());
  const { access_token, refresh_token } = getCookies();
  if (!access_token) {
    console.log("no access token");
    if (!refresh_token) {
      console.log("no refresh token");
      throw Error();
    }
    
    await refreshToken(refresh_token);
  }
  return fetch(url, requestInit);
}

const refreshToken = async (refreshToken: string) => {
  const res = await fetch("/api/auth/refresh", {
    method: "POST"
  });
  const accessToken = await res.json();
  setCookie("access_token", accessToken.token, {
    expires: accessToken.expire
  })
  return accessToken.token;
}
