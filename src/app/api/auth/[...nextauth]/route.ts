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
    access_token.expire = access_token.expire * JS_PYTHON_TIMESTAMP_GAP;
    refresh_token.expire = access_token.expire * JS_PYTHON_TIMESTAMP_GAP;
    return {
      accessToken: access_token,
      refreshToken: refresh_token,
    }
  } catch (e) {
    throw Error("Unauthorized");
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      console.log("jwt called.");
      if (account?.access_token) {
        const { access_token } = account;
        const res = await getJWTFromServer(access_token);
        console.log('res :>> ', res);
        token = Object.assign({}, token, { googleAccessToken: access_token });
        token = Object.assign({}, token, { accessToken: res.accessToken });
      }
      return token;
    },
    async session({ session, token }) {
      if (session) {
        session = Object.assign({}, session, {
          googleAccessToken: token.googleAccessToken,
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