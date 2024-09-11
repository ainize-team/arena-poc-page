import { NextRequest, NextResponse } from "next/server";

const failedRefresh = {
  token: undefined,
  expire: undefined,
};

const JS_PYTHON_TIMESTAMP_GAP = 1000;

/**
 * refresh token 으로 Backend 에 access token 재발급 요청
 */

export async function GET(req: NextRequest) {
  const endpoint = `${process.env.SERVER_URL}/auth/refresh`;
  const refreshToken = req.cookies.get("refresh_token");
  console.log('refreshToken :>> ', refreshToken);
  try {
    const result = await fetch(endpoint, {
      method: "GET",
      headers: { 
        Cookie: `refresh_token=${refreshToken?.value};`,
        "x-api-key": process.env.SERVER_API_KEY!,
      },
    });
    const refreshResult = await result.json();
    const { access_token } = refreshResult;
    access_token.expire = Math.round(access_token.expire * JS_PYTHON_TIMESTAMP_GAP);
    return Response.json(access_token, { status: 200 });
  } catch (e) {
    console.log("Refresh Error", e);
    return Response.json(failedRefresh, { status: 500 });
  }
}
