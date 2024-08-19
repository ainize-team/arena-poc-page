import { DefaultSession, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { UserInfo } from "./type";

declare module 'next-auth' {
  interface Session {
    accessToken: {
      token: string;
      expire: number;
    };
    refreshToken: {
      token: string;
      expire: number;
    };
    googleAccessToken: string;
    user: UserInfo & Omit<DefaultSession["user"], "image">;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: {
      token: string;
      expire: number;
    };
    refreshToken: {
      token: string;
      expire: number;
    },
    googleAccessToken: string;
  }
}
