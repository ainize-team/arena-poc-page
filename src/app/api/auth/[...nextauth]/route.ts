import { UserInfo } from "@/types/type";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google"

const ONE_SEC_AS_TIMESTAMP = 1000;
const JS_PYTHON_TIMESTAMP_GAP = 1000;

const getJWTFromServer = async (accessToken: string) => {
  const endpoint = `${process.env.SERVER_URL}/auth/login`;
  console.log("get Token");
  const params = {
    method: "POST",
    body: JSON.stringify({
      google_access_token: accessToken
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      "x-api-key": process.env.SERVER_API_KEY!
    }
  }
  const res = await fetch(endpoint, params);
  try {
    const { access_token, refresh_token } = await res.json();
    access_token.expire = Math.round(access_token.expire * JS_PYTHON_TIMESTAMP_GAP); // FIXME(yoojin): change to JS_PYTHON_TIMESTAMP_GAP in constants
    refresh_token.expire = Math.round(refresh_token.expire * JS_PYTHON_TIMESTAMP_GAP);
    return {
      accessToken: access_token,
      refreshToken: refresh_token,
    }
  } catch (e) {
    throw Error(`Unauthorized: ${e}`);
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "",
  session: {
    maxAge: 24 * 60 * 60, // 1 day
    updateAge: 14 * 60 // 14 min
  },
  callbacks: {
    async jwt({ token, account }) {
      const googleAccessToken = account?.access_token || token.googleAccessToken;
      if (googleAccessToken) {
        token = Object.assign({}, token, {
          googleAccessToken: googleAccessToken
        })
        const curMs = Date.now();
        if (!token.refreshToken || token.refreshToken.expire < curMs - (60 * ONE_SEC_AS_TIMESTAMP)) {
          const { refreshToken, accessToken } = await getJWTFromServer(googleAccessToken);
          token = Object.assign({}, token, {
            refreshToken: refreshToken,
          });
          token = Object.assign({}, token, {
            accessToken: accessToken,
          });
          return token;
        }
        if (!token.accessToken || token.accessToken.expire < curMs - (60 * ONE_SEC_AS_TIMESTAMP)) {
          const endpoint = `${process.env.SERVER_URL}/auth/refresh`;
          const result = await fetch(endpoint, {
            method: "GET",
            headers: { 
              Cookie: `refresh_token=${token.refreshToken.token};`,
              "x-api-key": process.env.SERVER_API_KEY!
            }
          });
          const refreshResult = await result.json();
          const { access_token } = refreshResult;
          access_token.expire = Math.round(access_token.expire * JS_PYTHON_TIMESTAMP_GAP);
          token = Object.assign({}, token, { accessToken: access_token });
        }
        const userInfo = await fetch(`${process.env.SERVER_URL}/user/me/info`, {
          method: "GET",
          headers: { 
            Cookie: `access_token=${token.accessToken.token};`,
            "x-api-key": process.env.SERVER_API_KEY!
          }
        });
        const data = await userInfo.json();
        token.user = data;
      }
      return token;
    },
    async session({ session, token }) {
      if (session) {
        const { refreshToken, accessToken } = token;
        session.refreshToken = refreshToken;
        session.accessToken = accessToken;
        session.user = Object.assign({}, token.user as UserInfo);
      }
      return session;
    }
  }
})

export { handler as GET, handler as POST };
