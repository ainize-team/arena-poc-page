import { JS_PYTHON_TIMESTAMP_GAP } from "@/constant/constant";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google"

const getJWTFromServer = async (accessToken: string) => {
  const endpoint = `${process.env.SERVER_URL}/auth/login`;
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
    async jwt({ token, account, session }) {
      console.log("jwt called.");
      if (account?.access_token) {
        const { access_token } = account;
        try {
          const res = await getJWTFromServer(access_token);
          token = Object.assign({}, token, { refreshToken: res.refreshToken });
          token = Object.assign({}, token, { accessToken: res.accessToken });
        }
        catch (e) {
          console.log('e :>> ', e);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session) {
        session = Object.assign({}, session, {
          refreshToken: token.refreshToken,
        });
        session = Object.assign({}, session, {
          accessToken: token.accessToken,
        });
      }
      return session;
    }
  }
})

export { handler as GET, handler as POST };
