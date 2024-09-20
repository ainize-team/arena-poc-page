import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest, 
) {
  const endpoint = `${process.env.SERVER_URL}/leaderboard`;
  const accessToken = req.cookies.get("access_token");
  try {
    const res = await fetch(endpoint, {
      method: "GET",
      cache: "no-cache",
      headers: { 
        "x-api-key": process.env.SERVER_API_KEY!
      }
    });
    const resData = await res.json();
    return Response.json(resData, {
      status: 200,
    });
  } catch (error) {
    return Response.json("", {
      status: 500,
    });
  }
}