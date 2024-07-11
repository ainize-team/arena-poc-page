import { Session } from "next-auth";

declare module 'next-auth' {
  interface Session {
    accessToken: {
      token: string;
      expire: number;
    };
    refreshToken: {
      token: string;
      expire: number;
    }
    googleAccessToken: string;
  }
}
