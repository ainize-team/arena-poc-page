import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

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
