import { JS_PYTHON_TIMESTAMP_GAP } from "@/constant/constant";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google"

const getJWTFromServer = async (accessToken: string) => {
  const endpoint = `${process.env.SERVER_URL}/auth/login`;
  console.log("get Token");
  const params = {
    method: "POST",
    body: JSON.stringify({
      google_access_token: accessToken
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  }
  const res = await fetch(endpoint, params);
  try {
    const { access_token, refresh_token } = await res.json();
    access_token.expire = Math.round(access_token.expire * 1000); // FIXME(yoojin): change to JS_PYTHON_TIMESTAMP_GAP in constants
    refresh_token.expire = Math.round(refresh_token.expire * 1000);
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
  session: {
    maxAge: 24 * 60 * 60 // 1 day
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        const curMs = new Date().getMilliseconds();
        if (!token.refreshToken || token.refreshToken.expire < curMs - (60 * 1000)) {
          console.log("get JWT");
          const { refreshToken, accessToken } = await getJWTFromServer(account?.access_token);
          token = Object.assign({}, token, {
            refreshToken: refreshToken,
          });
          token = Object.assign({}, token, {
            accessToken: accessToken,
          });
        }
        if (!token.accessToken || token.accessToken.expire < curMs - (60 * 1000)) {
          console.log("refresh");
          const refreshRes = await fetch("/api/auth/refresh", {
            method: "POST",
            headers: {
              Cookie: `refresh_token=${token.refreshToken.token};`
            }
          });
          const newAccessToken = await refreshRes.json();
          token = Object.assign({}, token, { accessToken: newAccessToken });
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session) {
        const { refreshToken, accessToken } = token;
        session = Object.assign({}, session, {
          refreshToken: refreshToken,
        });
        session = Object.assign({}, session, {
          accessToken: accessToken,
        });
      }
      return session;
    }
  }
})

export { handler as GET, handler as POST };
