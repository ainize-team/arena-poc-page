import { NextRequest, NextResponse } from "next/server";

const failedRefresh = {
  token: undefined,
  expire: undefined
}

/**
 * refresh token 으로 Backend 에 access token 재발급 요청
 */

export async function POST(req: NextRequest) {
  const endpoint = `${process.env.SERVER_URL}/auth/refresh`;
  const refreshToken = req.cookies.get("refresh_token");
  try {
    const result = await fetch(endpoint, {
      method: "GET",
      headers: { Cookie: `refresh_token=${refreshToken?.value};` }
    });
    const refreshResult = await result.json();
    const { access_token } = refreshResult;
    access_token.expire = Math.round(access_token.expire * 1000);
    return Response.json(access_token, { status: 200 });
  } catch (e) {
    return Response.json(failedRefresh, { status: 500 });
  }
}