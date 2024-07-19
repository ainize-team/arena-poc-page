import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const endpoint = `${process.env.SERVER_URL}/auth/refresh`;
  const refreshToken = req.cookies.get("refresh_token");
  const result = await fetch(endpoint, {
    method: "GET",
    headers: { Cookie: `access_token=${refreshToken?.value};` }
  });
  const accessToken = await result.json();
  console.log('accessToken :>> ', accessToken);
  return Response.json({ accessToken }, {status: 200});
}